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
        booking_id: bookingId,
        user_id: userId,
      },
    });
    if (booking.user_id !== userId) {
      res.send("The user is not the owner of the booking");
      return;
    }
  } catch (error) {
    res.send({ message: "error fetching booking details", status: false });
    return;
  }

  //post the booking for bidding
  try {
    const biddingStatus = true;
    await prisma.booking.update({
      where: {
        booking_id_user_id: {
          booking_id: bookingId,
          user_id: userId,
        },
      },
      data: {
        bidding: biddingStatus,
      },
    });
    res.send({ message: "booking status updated successfully", status: true });
    return;
  } catch (error) {
    console.log(error);
    res.send({ status: false, message: "error updating booking status" });
    return;
  }
});

module.exports = router;
