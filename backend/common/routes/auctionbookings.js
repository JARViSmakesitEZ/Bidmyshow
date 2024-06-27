const express = require("express");
const router = express.Router();
const verifyToken = require("../../middleware/verifyToken");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

router.get("/auctionbookings", async (req, res) => {
  try {
    const bookings = await prisma.booking.findMany({
      where: { bidding: true },
      include: {
        User: {
          select: {
            name: true,
          },
        },
        Show: {
          select: {
            name: true,
          },
        },
      },
    });

    const finalbookings = await Promise.all(
      bookings.map(async (booking) => {
        try {
          let bids = await prisma.bid.findMany({
            where: { booking_id: booking.id, status: "pending" },
          });

          if (bids.length === 0) {
            return { ...booking, highestBid: null };
          } else {
            bids.sort((a, b) => a.id - b.id);
            return { ...booking, highestBid: bids[bids.length - 1].amount };
          }
        } catch (err) {
          console.error("Error fetching bid details for each booking:", err);
          throw new Error("Failed to fetch bid details");
          // You may choose to handle the error differently based on your application's requirements
        }
      })
    );

    res.json(finalbookings);
    return;
  } catch (err) {
    res.send("error fetching bookings up for bidding.");
    console.log(err);
    return;
  }
});

module.exports = router;
