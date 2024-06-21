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
        console.log(booking);
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
                where: { booking_id: booking.id },
              });

              console.log("Bids for Booking ID:", booking.id, bids);

              if (bids.length === 0) {
                return {
                  ...booking,
                  showname: show.name,
                  highestBidder: null,
                };
              }

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
  let show = null;
  let user = null;

  //check if seat available
  try {
    show = await prisma.show.findFirst({
      where: { id: showId },
    });
    if (show.booked_seats === show.total_seats) {
      res.send("No seats left.");
    }
  } catch (err) {
    res.send("error fetching the show details");
  }

  //check if enough balance
  try {
    user = await prisma.user.findFirst({
      where: { id: userId },
    });
    console.log(user);
    console.log(show);
    if (user.balance < show.ticket_price) {
      res.send("Not Enough Balance");
    }
  } catch (error) {
    res.send("error fetching user details");
    console.log(error);
  }

  //book seat
  try {
    const booking = await prisma.booking.create({
      data: { ...body, amount: show.ticket_price },
    });

    //update booked seats
    const booked_seats = show.booked_seats;
    const updated_booked_seats = booked_seats + 1;
    await prisma.show.update({
      where: {
        id: showId,
      },
      data: {
        booked_seats: updated_booked_seats,
      },
    });

    //deduct amount from the user balance
    const userBalance = user.balance;
    const updated_userBalance = userBalance - show.ticket_price;
    await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        balance: updated_userBalance,
      },
    });

    console.log("New Booking registered.");
    res.status(200).send("Booking registered successfully");
  } catch (error) {
    console.error("Error registering Booking:", error);

    // Respond with an error message
    res.status(500).send("Error registering Booking");
  }
});

module.exports = router;
