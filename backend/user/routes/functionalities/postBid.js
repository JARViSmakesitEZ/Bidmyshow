const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

router.post("/postbid", async (req, res) => {
  body = req.body;
  const userId = body.user_id;
  const bookingId = body.booking_id;
  let booking = null;

  //check if the user is the owner of the booking
  try {
    booking = await prisma.booking.findFirst({
      where: {
        id: bookingId,
      },
    });
    if (booking.user_id !== userId) {
      res.send("The user is not the owner of the booking");
      return;
    }
  } catch (error) {
    res.send("error fetching booking details");
    return;
  }

  //post the booking for bidding
  try {
    const biddingStatus = true;
    await prisma.booking.update({
      where: {
        id: bookingId,
      },
      data: {
        bidding: biddingStatus,
      },
    });
    res.send("booking status updated successfully");
    return;
  } catch (error) {
    res.send("error updating booking status");
    return;
  }
});

module.exports = router;
