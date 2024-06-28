const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

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
  const body = req.body;
  const showId = body.show_id;
  const userId = body.user_id;

  try {
    const result = await prisma.$transaction(async (prisma) => {
      // Check if seat available
      const show = await prisma.show.findFirst({
        where: { id: showId },
      });
      if (show.booked_seats === show.total_seats) {
        res.json({ message: "No seats left.", status: false });
        throw new Error("Transaction aborted: no seats left.");
      }

      // Check if enough balance
      const user = await prisma.user.findFirst({
        where: { id: userId },
      });
      if (user.balance < show.ticket_price) {
        res.json({ message: "Not Enough Balance.", status: false });
        throw new Error("Transaction aborted: not enough balance.");
      }

      // Book seat
      const booking = await prisma.booking.create({
        data: { ...body, amount: show.ticket_price },
      });

      // Update booked seats
      const updated_booked_seats = show.booked_seats + 1;
      await prisma.show.update({
        where: { id: showId },
        data: { booked_seats: updated_booked_seats },
      });

      // Deduct amount from the user balance
      const updated_userBalance = user.balance - show.ticket_price;
      await prisma.user.update({
        where: { id: userId },
        data: { balance: updated_userBalance },
      });

      return booking;
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
