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
  let currbooking = null;

  //check if the userId is valid
  try {
    user = await prisma.user.findFirst({
      where: { id: userId },
    });
  } catch (error) {
    res.send({
      status: false,
      message: "error fetching user details/user doesn't exist",
    });
    return;
  }

  //check if the bookingId is valid
  try {
    currbooking = await prisma.booking.findFirst({
      where: { booking_id: bookingId, user_id: userId },
    });
  } catch (error) {
    res.send({
      status: false,
      message: "error fetching booking details/booking doesn't exist",
    });
    return;
  }

  //check if the userId is the owner of the bookingId
  if (currbooking == null) {
    res.send({
      status: false,
      message: "the user is not the owner of the booking",
    });
    return;
  }

  //check if the booking is up for bidding
  if (currbooking.bidding === false) {
    res.send({ status: false, message: "booking is not up for bidding" });
    return;
  }

  //check if there is any bid on the booking
  try {
    bids = await prisma.bid.findMany({
      where: {
        booking_id: bookingId,
        booking_user_id: userId,
      },
    });
    console.log(bids);
    bids.sort((a, b) => a.id - b.id);
    if (bids.length === 0) {
      res.send({ status: false, message: "no bids on this booking" });
      return;
    }
  } catch (error) {
    res.send({ status: true, message: "error fetching bid data" });
    return;
  }

  //accept the bid
  try {
    latestBid = bids[bids.length - 1];
    const latestBidUserId = latestBid.bidder_id;
    const latestBidAmount = latestBid.amount;

    //update the bid status
    try {
      await prisma.bid.update({
        where: {
          id: latestBid.id,
        },
        data: {
          status: "accepted",
        },
      });
    } catch (err) {
      res.send({
        status: false,
        message: "error updating the highest bid status.",
      });
      return;
    }

    //update the booking details
    await prisma.booking.update({
      where: { booking_id_user_id: { booking_id: bookingId, user_id: userId } },
      data: {
        status: "sold",
        bidding: false,
      },
    });

    await prisma.booking.create({
      data: {
        booking_id: currbooking.booking_id,
        user_id: latestBidUserId,
        amount: latestBidAmount,
        show_id: currbooking.show_id,
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
      res.send({ status: false, message: "error updating bidder data" });
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
      res.send({ status: false, message: "error updating user details" });
      return;
    }
    res.send({ status: true, message: "bid accepted successfully" });
  } catch (error) {
    res.send({ status: false, message: "error accepting the bid" });
    console.log(error);
    return;
  }
});

module.exports = router;
