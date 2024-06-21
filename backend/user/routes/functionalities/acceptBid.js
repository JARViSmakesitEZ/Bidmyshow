const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

router.post("/acceptbid", async (req, res) => {
  body = req.body;
  const userId = body.user_id;
  const bookingId = body.booking_id;
  let latestBid = null;
  let user = null;
  let bids = null;
  let booking = null;

  //check if the userId is valid
  try {
    user = await prisma.user.findFirst({
      where: { id: userId },
    });
  } catch (error) {
    res.send("error fetching user details/user doesn't exist");
    return;
  }
  console.log("user id is valiid");

  //check if the bookingId is valid
  try {
    booking = await prisma.booking.findFirst({
      where: { id: bookingId },
    });
  } catch (error) {
    res.send("error fetching booking details/booking doesn't exist");
    return;
  }
  console.log("booking id is valid");

  //check if the userId is the owner of the bookingId
  if (booking.user_id !== userId) {
    res.send("the user is not the owner of the booking");
    return;
  }

  //check if the booking is up for bidding
  if (booking.bidding === false) {
    res.send("booking is not up for bidding");
    return;
  }

  //check if there is any bid on the booking
  try {
    bids = await prisma.bid.findMany({
      where: {
        booking_id: bookingId,
      },
    });
    console.log(bids);
    if (bids.length === 0) {
      res.send("no bids on this booking");
      return;
    }
  } catch (error) {
    res.send("error fetching bid data");
    return;
  }
  console.log("there is bid on the booking");

  //accept the bid
  try {
    latestBid = bids[bids.length - 1];
    const latestBidUserId = latestBid.bidder_id;
    const latestBidAmount = latestBid.amount;

    //update the booking details
    await prisma.booking.update({
      where: { id: bookingId },
      data: {
        user_id: latestBidUserId,
        amount: latestBidAmount,
        bidding: false,
      },
    });

    //update bidder's balance
    try {
      const bidder = await prisma.user.findFirst({
        where: {
          id: latestBid.bidder_id,
        },
      });
      const bidderNewBalance = bidder.balance - latestBid.amount;
      await prisma.user.update({
        where: {
          id: latestBid.bidder_id,
        },
        data: {
          balance: bidderNewBalance,
        },
      });
    } catch (error) {
      res.send("error updating bidder data");
      console.log(error);
      return;
    }

    console.log("bidder data updated");

    //update previous booking owner's balance
    try {
      const userNewBalance = user.balance + latestBid.amount;
      await prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          balance: userNewBalance,
        },
      });
    } catch (error) {
      res.send("error updating user details");
      return;
    }
    res.send("bid accepted successfully");
  } catch (error) {
    res.send("error accepting the bid");
    console.log(error);
    return;
  }
});

module.exports = router;
