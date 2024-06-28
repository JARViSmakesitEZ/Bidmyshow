const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

router.post("/placebid", async (req, res) => {
  body = req.body;
  const bidderId = body.bidder_id;
  const bookingId = body.booking_id;
  const userId = body.user_id;
  const amount = body.amount;
  body.amount = parseInt(body.amount);
  let bidder = null;
  let booking = null;
  let bids = null;

  //check if the booking is up for bidding
  try {
    booking = await prisma.booking.findFirst({
      where: {
        booking_id: bookingId,
        user_id: userId,
      },
    });
    if (booking.bidding === false) {
      res.send({ status: false, message: "booking is not up for bidding." });
      return;
    }
  } catch (error) {
    console.log(error);
    res.send({ status: false, message: "error fetching booking details" });
    return;
  }

  //check if the amount the bidder is bidding is greater than the amount paid for booking
  if (booking.amount >= amount) {
    res.send({
      status: false,
      message: "the bidding amount should be greater than the booking amount",
    });
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
      res.send({
        status: false,
        message: "bidder doesn't have enough balance",
      });
      return;
    }
  } catch (error) {
    console.log(error);
    res.send({ status: false, message: "error fetching bidder details" });
    return;
  }

  //check if the current max bid is lesser than the bidding amount
  try {
    bids = await prisma.bid.findMany({
      where: {
        booking_id: bookingId,
      },
    });
    bids.sort((a, b) => a.id - b.id);
    if (bids.length > 0 && bids[bids.length - 1].amount >= amount) {
      res.send({
        status: false,
        message: "The amount must be greater than the current max bid amount",
      });
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
          res.send({
            status: false,
            message: "The amount must be greater than the ticket price",
          });
          return;
        }
      } catch (error) {
        console.log(error);
        res.send({ status: false, message: "Error fetching show details" });
        return;
      }
    }
  } catch (error) {
    console.log(error);
    res.send({
      status: false,
      message: "Error fetching previous bidding data for the booking",
    });
    return;
  }

  //register the bid
  try {
    await prisma.bid.create({
      data: {
        bidder_id: body.bidder_id,
        booking_id: body.booking_id,
        booking_user_id: booking.user_id,
        amount: body.amount,
      },
    });

    if (bids.length > 0) {
      const lastMaxBid = bids[bids.length - 1];
      try {
        await prisma.bid.update({
          where: { id: lastMaxBid.id },
          data: { status: "captured" },
        });
      } catch (err) {
        res.send({
          status: false,
          message: "error updating last max bid status",
        });
        return;
      }
    }
    res.send({ status: true, message: "Bid registered successfully" });
    return;
  } catch (error) {
    res.send({ status: false, message: "Error registering the bid" });
    console.log(error);
    return;
  }
});

module.exports = router;
