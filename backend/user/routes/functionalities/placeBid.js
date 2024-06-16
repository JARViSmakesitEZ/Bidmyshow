const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

router.post("/placebid", async (req, res) => {
  body = req.body;
  const bidderId = body.bidder_id;
  const bookingId = body.booking_id;
  const amount = body.amount;
  let bidder = null;
  let booking = null;

  //check if the booking is up for bidding
  try {
    booking = await prisma.booking.findFirst({
      where: {
        id: bookingId,
      },
    });
    if (booking.bidding === false) {
      res.send("booking is not up for bidding.");
      return;
    }
  } catch (error) {
    res.send("error fetching booking details");
    return;
  }
  console.log("booking is up for bidding");

  //check if the amount the bidder is bidding is greater than the amount paid for booking
  if (booking.amount >= amount) {
    res.send("the bidding amount should be greater than the booking amount");
    return;
  }

  //check if the bidder has balance >= amount
  try {
    bidder = await prisma.user.findFirst({
      where: {
        id: bidderId,
      },
    });
    if (bidder.balance < amount) {
      res.send("bidder doesn't have enough balance");
      return;
    }
  } catch (error) {
    res.send("error fetching bidder details");
    return;
  }
  console.log("bidder has enough balance.");

  //check if the current max bid is lesser than the bidding amount
  try {
    const bids = await prisma.bid.findMany({
      where: {
        booking_id: bookingId,
      },
    });
    if (bids.length > 0 && bids[bids.length - 1].amount >= amount) {
      res.send("The amount must be greater than the current max bid amount");
      return;
    } else if (bids.length === 0) {
      //check if the bidding amount is greater than the acutal ticket price
      try {
        const showId = booking.show_id;
        const show = await prisma.show.findFirst({
          where: {
            id: showId,
          },
        });
        if (show.ticket_price > amount) {
          res.send("The amount must be greater than the ticket price");
          return;
        }
      } catch (error) {
        res.send("Error fetching show details");
        return;
      }
    }
  } catch (error) {
    console.log(error);
    res.send("Error fetching previous bidding data for the booking");
    return;
  }
  console.log("bidding constraints satisfied");

  //register the bid
  try {
    await prisma.bid.create({
      data: body,
    });
    res.send("Bid registered successfully");
    return;
  } catch (error) {
    res.send("Error registering the bid");
    console.log(error);
    return;
  }
});

module.exports = router;
