const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const RESERVATION_TIME = 5000;

router.get("/booking/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  let bookings;
  try {
    bookings = await prisma.booking.findMany({
      where: { user_id: id },
    });
    // console.log(bookings);

    const bookingsPack = await Promise.all(
      bookings.map(async (booking) => {
        const show_id = booking.show_id;
        const bidding = booking.bidding;
        let show;
        let bids;

        try {
          show = await prisma.show.findFirst({
            where: { id: show_id },
          });

          if (bidding === true) {
            try {
              bids = await prisma.bid.findMany({
                where: {
                  booking_id: booking.booking_id,
                  booking_user_id: booking.user_id,
                },
              });

              if (bids.length === 0) {
                return {
                  ...booking,
                  showname: show.name,
                  highestBidder: null,
                };
              }

              bids.sort((a, b) => a.id - b.id);

              const latestBid = bids[bids.length - 1];

              try {
                const bidder = await prisma.user.findFirst({
                  where: {
                    id: latestBid.bidder_id,
                  },
                });

                return {
                  ...booking,
                  showname: show.name,
                  highestBidder: {
                    name: bidder.name,
                    amount: latestBid.amount,
                  },
                };
              } catch (err) {
                console.error("Error fetching the bidder details:", err);
                throw new Error("Error fetching the bidder details");
              }
            } catch (err) {
              console.error("Error fetching bid details on the booking:", err);
              throw new Error("Error fetching bid details on the booking");
            }
          } else {
            return {
              ...booking,
              showname: show.name,
              highestBidder: null,
            };
          }
        } catch (err) {
          console.error("Error fetching show details:", err);
          throw new Error("Error fetching show details");
        }
      })
    );
    res.send(bookingsPack);
  } catch (err) {
    console.error("Error fetching booking details of the user:", err);
    res.status(500).send("Error fetching booking details of the user.");
  }
});

router.post("/booking", async (req, res) => {
  console.log("hi i just got hit");
  const body = req.body;
  const showId = body.show_id;
  const userId = body.user_id;
  const now = new Date();

  try {
    const result = await prisma.$transaction(async (prisma) => {
      // Lock the show row
      const show =
        await prisma.$queryRaw`SELECT * FROM "Show" WHERE id = ${showId} FOR UPDATE`;
      if (!show || show.length === 0) {
        res.status(404).json({ message: "Show not found", status: false });
        throw new Error("Transaction aborted: show not found.");
      }

      if (show[0].booked_seats === show[0].total_seats) {
        res.json({ message: "No seats left.", status: false });
        throw new Error("Transaction aborted: no seats left.");
      }

      // Lock the user row
      const user =
        await prisma.$queryRaw`SELECT * FROM "User" WHERE id = ${userId} FOR UPDATE`;
      if (!user || user.length === 0) {
        res.status(404).json({ message: "User not found", status: false });
        throw new Error("Transaction aborted: user not found.");
      }

      if (user[0].balance < show[0].ticket_price) {
        res.json({ message: "Not Enough Balance.", status: false });
        throw new Error("Transaction aborted: not enough balance.");
      }

      // Check if user already has a booking for this show with status "own"
      const existingBooking = await prisma.booking.findFirst({
        where: {
          user_id: userId,
          show_id: showId,
          status: "own",
        },
      });

      if (existingBooking) {
        res.json({
          message: "You already have a booking for this show",
          status: false,
        });
        throw new Error("Transaction aborted: duplicate booking.");
      }

      const newBookingId = show[0].booked_seats + 1;
      const seat = await prisma.booking.findFirst({
        where: { booking_id: newBookingId, user_id: userId },
      });
      const now = new Date();
      const expiresAt = new Date(now.getTime() + RESERVATION_TIME);

      if (seat) {
        if (seat.expiresAt > expiresAt) {
          res.json({
            message: "Some Error. Please try again later.",
            status: false,
          });
          return;
        }

        try {
          await prisma.booking.update({
            where: {
              booking_id: newBookingId,
              expiresAt: { lte: now },
            },
            data: {
              user_id: userId,
              expiresAt,
              version: { increment: 1 },
            },
          });
        } catch (err) {
          res.json({
            message: "Some Error. Please try again later.",
            status: false,
          });
          return;
        }
      } else {
        // Book seat and assign booking ID as number of booked seats
        const bookingId = show[0].booked_seats + 1;
        const booking = await prisma.booking.create({
          data: {
            ...body,
            amount: show[0].ticket_price,
            booking_id: bookingId, // Assigning booking ID
            expiresAt,
            version: 0, // Initial version
          },
        });

        // Update booked seats
        await prisma.show.update({
          where: { id: showId },
          data: { booked_seats: { increment: 1 } },
        });

        // Deduct amount from the user balance
        await prisma.user.update({
          where: { id: userId },
          data: { balance: { decrement: show[0].ticket_price } },
        });
      }
    });

    res
      .status(200)
      .json({ message: "Booking registered successfully", status: true });
  } catch (error) {
    if (error.message.startsWith("Transaction aborted:")) {
      console.log("Transaction aborted:", error.message);
      // No need to send another response, since it's already sent
    } else {
      console.error("Error registering Booking:", error.message);
      res
        .status(500)
        .send({ message: "Internal Server Error.", status: false });
    }
  }
});

module.exports = router;
