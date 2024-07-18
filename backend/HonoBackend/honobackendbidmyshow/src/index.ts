import { Hono } from "hono";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { sign, verify } from "hono/jwt";
import { cors } from "hono/cors";

const app = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    SECRET_KEY: string;
  };
}>();

app.use("/*", cors());

app.get("/", (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());
  return c.text("Hello Hono!");
});

////////////////////////THEATRE ROUTES//////////////////////////////
app.post("/theatre/registershow", async (c) => {
  const SECRET_KEY = c.env.SECRET_KEY;
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());
  const body = await c.req.json(); // Parse JSON body from request
  const { interests, ...showData } = body;

  try {
    const show = await prisma.show.create({
      data: showData,
    });

    if (!interests || interests.length === 0) {
      try {
        await prisma.show.delete({
          where: { id: show.id },
        });
      } catch (err) {
        console.error("Error deleting show:", err);
        return;
      }
      return c.json({ status: false, message: "Enter at least 1 interest." });
    }

    for (const i of interests) {
      try {
        const interest = await prisma.interest.findFirst({
          where: { name: i },
        });
        if (!interest) {
          try {
            await prisma.show.delete({
              where: { id: show.id },
            });
          } catch (err) {
            console.error("Error deleting show:", err);
            return;
          }
          return c.json({
            status: false,
            message: "Error finding the interest.",
          });
        }

        const result = await prisma.showInterests.create({
          data: { showId: show.id, interestId: interest.id },
        });
      } catch (err) {
        console.error("Error creating show interest mapping:", err);
        try {
          await prisma.show.delete({
            where: { id: show.id },
          });
        } catch (err) {
          console.error("Error deleting show:", err);
          return;
        }
        return c.json({
          status: false,
          message: "Error creating show interest mapping.",
        });
      }
    }

    return c.json({ status: true, message: "Show registered successfully" });
  } catch (error) {
    console.error("Error registering Show:", error);
    return c.json({ status: false, message: "Error registering Show" });
  }
});

app.get("/theatre/showstatus/:id", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());
  const showId = c.req.query("id");

  try {
    const show = await prisma.show.findFirst({
      where: {
        id: parseInt(showId),
      },
    });

    if (!show) {
      return c.json({
        message: `Show with ID ${showId} not found.`,
        status: false,
      });
    }

    return c.json({ message: "Show found.", status: true, data: show });
  } catch (error) {
    console.error("Error fetching show status:", error);
    return c.json({
      message: "Error fetching show status.",
      status: false,
      error,
      showId,
    });
  }
});

app.post("/theatre/login", async (c) => {
  //works
  const SECRET_KEY = c.env.SECRET_KEY;
  const prisma = new PrismaClient({
    datasources: {
      db: {
        url: c.env.DATABASE_URL,
      },
    },
  }).$extends(withAccelerate());

  try {
    const data = await c.req.json(); // Ensure JSON body is parsed
    const { email, password } = data;

    if (!email || !password) {
      return c.json(
        {
          message: "Email and password both are required",
          status: false,
        },
        400
      ); // Bad Request
    }

    const user = await prisma.theatre.findFirst({
      where: {
        email: email,
      },
    });

    if (!user) {
      return c.json(
        { message: "Invalid email or password", status: false },
        401
      ); // Unauthorized
    }

    const isPasswordValid = password === user.password;
    if (!isPasswordValid) {
      return c.json(
        { message: "Invalid email or password", status: false },
        401
      ); // Unauthorized
    }

    const token = await sign({ id: user.id, email }, SECRET_KEY);

    return c.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        location: user.location,
      },
      token,
    });
  } catch (error) {
    console.error("Error during authentication:", error);
    return c.json({ message: "Internal server error", status: false }, 500); // Internal Server Error
  } finally {
    await prisma.$disconnect();
  }
});

app.post("/theatre/register", async (c) => {
  let globalBod;
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());
  try {
    // Parse JSON body from request
    const body = await c.req.json();
    globalBod = body;

    // Create a new theatre record using Prisma
    const theatre = await prisma.theatre.create({
      data: {
        name: body.name,
        password: body.password,
        location: body.location,
        email: body.email,
      },
    });

    console.log("New Theatre registered.");
    return c.text("Theatre registered successfully", 200); // Respond with text message and status 200
  } catch (error) {
    console.error("Error registering Theatre:", error);

    // Respond with an error message and set status code 500
    return c.json(
      {
        message: "Error registering Theatre",
        status: false,
        error: error.message, // Only include error message for security reasons
        body: globalBod,
        url: c.env.DATABASE_URL,
      },
      500
    );
  } finally {
    await prisma.$disconnect(); // Ensure Prisma client disconnects
  }
});

app.get("/theatre/home", (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());
  const authorizationHeader = c.req.header("authorization");
  if (!authorizationHeader) {
    return c.json(
      { message: "Authorization header missing", status: false },
      401
    );
  }

  const token = authorizationHeader.split(" ")[1];
  if (!token) {
    return c.json({ message: "Token missing", status: false }, 401);
  }
  return c.text("Welcome to the home page!"); // Using c.text() to send a plain text response
});

/////////////////////////////////THEATRE ROUTES/////////////////////////////////////

///////////////////////////////////USER ROUTES//////////////////////////////////////

app.get("/user/home", async (c) => {
  //works
  const SECRET_KEY = c.env.SECRET_KEY;
  const prisma = new PrismaClient({
    datasources: {
      db: {
        url: c.env.DATABASE_URL,
      },
    },
  }).$extends(withAccelerate());

  const authorizationHeader = c.req.header("authorization");
  if (!authorizationHeader) {
    return c.json(
      { message: "Authorization header missing", status: false },
      401
    );
  }

  const token = authorizationHeader.split(" ")[1];
  if (!token) {
    return c.json({ message: "Token missing", status: false }, 401);
  }

  let decoded;
  try {
    decoded = verify(token, SECRET_KEY);
  } catch (err) {
    return c.json({ message: "Invalid token", status: false }, 401);
  }

  const userId = decoded.id;

  try {
    const user = await prisma.user.findFirst({
      where: { id: userId },
    });

    if (!user) {
      return c.json({ status: false, message: "User not found" }, 404);
    }

    const shows = await prisma.show.findMany();

    const userInterestsResult = await prisma.userInterests.findMany({
      where: { userId: user.id },
      select: { interestId: true },
    });

    const userInterestIds = userInterestsResult.map(
      (interest) => interest.interestId
    );

    const userInterests = await Promise.all(
      userInterestIds.map(async (id) => {
        const interest = await prisma.interest.findFirst({
          where: { id },
          select: { name: true },
        });
        return interest ? interest.name : null;
      })
    );

    const showsWithInterests = await Promise.all(
      shows.map(async (show) => {
        const interestsResult = await prisma.showInterests.findMany({
          where: { showId: show.id },
          select: { interestId: true },
        });

        const interestIds = interestsResult.map((i) => i.interestId);

        const interests = await Promise.all(
          interestIds.map(async (id) => {
            const interest = await prisma.interest.findFirst({
              where: { id },
              select: { name: true },
            });
            return interest ? interest.name : null;
          })
        );

        return { ...show, interests };
      })
    );

    return c.json({
      user: { ...user, userInterests: userInterests.filter(Boolean) }, // Filter out null values
      shows: showsWithInterests,
    });
  } catch (error) {
    console.error("Error:", error);
    return c.json({ message: "Internal server error", status: false }, 500);
  } finally {
    await prisma.$disconnect();
  }
});

app.post("/user/login", async (c) => {
  //works
  const SECRET_KEY = c.env.SECRET_KEY;
  const prisma = new PrismaClient({
    datasources: {
      db: {
        url: c.env.DATABASE_URL,
      },
    },
  }).$extends(withAccelerate());

  try {
    const data = await c.req.json(); // Ensure JSON body is parsed
    const { email, password } = data;

    if (!email || !password) {
      return c.json(
        {
          message: "Email and password both are required",
          status: false,
        },
        400
      ); // Bad Request
    }

    const user = await prisma.user.findFirst({
      where: {
        email: email,
      },
    });

    if (!user) {
      return c.json(
        { message: "Invalid email or password", status: false },
        401
      ); // Unauthorized
    }

    const isPasswordValid = password === user.password;
    if (!isPasswordValid) {
      return c.json(
        { message: "Invalid email or password", status: false },
        401
      ); // Unauthorized
    }

    const token = await sign({ id: user.id, email }, SECRET_KEY);

    let interestsRes;
    try {
      interestsRes = await prisma.userInterests.findMany({
        where: {
          userId: user.id,
        },
        select: {
          interest: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });
    } catch (err) {
      console.error("Error fetching user interests:", err);
      return c.json(
        {
          message: "Error fetching user interests.",
          status: false,
        },
        500
      ); // Internal Server Error
    }

    const interests = interestsRes.map((i) => {
      return { id: i.interest.id, name: i.interest.name };
    });

    return c.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        balance: user.balance,
      },
      token,
      interests,
    });
  } catch (error) {
    console.error("Error during authentication:", error);
    return c.json({ message: "Internal server error", status: false }, 500); // Internal Server Error
  } finally {
    await prisma.$disconnect();
  }
});

app.post("/user/register", async (c) => {
  //works
  const SECRET_KEY = c.env.SECRET_KEY;
  const prisma = new PrismaClient({
    datasources: {
      db: {
        url: c.env.DATABASE_URL,
      },
    },
  }).$extends(withAccelerate());

  const body = await c.req.json();
  const { interests, ...userData } = body;

  if (!interests || interests.length === 0) {
    return c.json(
      { message: "Enter at least one interest.", status: false },
      400
    );
  }

  try {
    const user = await prisma.user.create({
      data: {
        name: userData.name,
        password: userData.password,
        email: userData.email,
        balance: userData.balance,
      },
    });

    const interestPromises = interests.map(async (i) => {
      const interest = await prisma.interest.findFirst({
        where: { name: i },
      });
      if (!interest) {
        throw new Error(`Interest ${i} not found.`);
      }
      await prisma.userInterests.create({
        data: { userId: user.id, interestId: interest.id },
      });
    });

    await Promise.all(interestPromises);

    return c.json({ status: true, message: "User registered successfully" });
  } catch (error) {
    console.error("Error registering User:", error);

    // If user creation fails, attempt cleanup
    if (error.code === "P2002") {
      return c.json(
        { status: false, message: "User with this email already exists" },
        400
      );
    } else {
      return c.json({ status: false, message: "Error registering User" }, 500);
    }
  } finally {
    await prisma.$disconnect();
  }
});

app.get("/user/booking/:id", async (c) => {
  //works
  const prisma = new PrismaClient({
    datasources: {
      db: {
        url: c.env.DATABASE_URL,
      },
    },
  }).$extends(withAccelerate());

  const id = parseInt(c.req.param("id"));
  if (isNaN(id)) {
    return c.json({ message: "Invalid user ID", status: false });
  }

  try {
    const bookings = await prisma.booking.findMany({
      where: { user_id: id },
    });

    const bookingsPack = await Promise.all(
      bookings.map(async (booking) => {
        const show = await prisma.show.findFirst({
          where: { id: booking.show_id },
        });

        if (booking.bidding) {
          const bids = await prisma.bid.findMany({
            where: {
              booking_id: booking.booking_id,
              booking_user_id: booking.user_id,
            },
            orderBy: { id: "desc" },
          });

          if (bids.length === 0) {
            return {
              ...booking,
              showname: show.name,
              highestBidder: null,
            };
          }

          const latestBid = bids[0];
          const bidder = await prisma.user.findFirst({
            where: { id: latestBid.bidder_id },
          });

          return {
            ...booking,
            showname: show.name,
            highestBidder: {
              name: bidder.name,
              amount: latestBid.amount,
            },
          };
        } else {
          return {
            ...booking,
            showname: show.name,
            highestBidder: null,
          };
        }
      })
    );

    return c.json(bookingsPack);
  } catch (err) {
    console.error("Error fetching booking details of the user:", err);
    return c.json({
      message: "Error fetching booking details of the user.",
      status: false,
    });
  } finally {
    await prisma.$disconnect();
  }
});

app.post("/user/booking", async (c) => {
  //works
  const prisma = new PrismaClient({
    datasources: {
      db: {
        url: c.env.DATABASE_URL,
      },
    },
  }).$extends(withAccelerate());

  const { show_id: showId, user_id: userId } = await c.req.json();
  const now = new Date();
  const RESERVATION_TIME = 5 * 1000; // 5 seconds

  try {
    const result = await prisma.$transaction(async (prisma) => {
      // Lock the show row
      const show = await prisma.$queryRaw`
        SELECT * FROM "Show" WHERE id = ${showId} FOR UPDATE
      `;

      // Type assertion for TypeScript
      const showRecord = show[0] as Show;

      if (!showRecord) {
        return { status: false, message: "Show not found" };
      }

      if (showRecord.booked_seats === showRecord.total_seats) {
        return { status: false, message: "No seats left" };
      }

      // Lock the user row
      const user = await prisma.$queryRaw`
        SELECT * FROM "User" WHERE id = ${userId} FOR UPDATE
      `;

      // Type assertion for TypeScript
      const userRecord = user[0] as User;

      if (!userRecord) {
        throw new Error("User not found");
      }

      if (userRecord.balance < showRecord.ticket_price) {
        return { status: false, message: "Not Enough Balance" };
      }

      const existingBooking = await prisma.booking.findFirst({
        where: { user_id: userId, show_id: showId, status: "own" },
      });

      const soldBooking = await prisma.booking.findFirst({
        where: { user_id: userId, show_id: showId, status: "sold" },
      });

      if (existingBooking) {
        return {
          status: false,
          message: "You already have a booking for this show",
        };
      }

      if (soldBooking) {
        return {
          status: false,
          message:
            "You sold your ticket for this show, so not allowed to book again.",
        };
      }

      const newBookingId = showRecord.booked_seats + 1;
      const expiresAt = new Date(now.getTime() + RESERVATION_TIME);

      const seat = await prisma.booking.findFirst({
        where: { booking_id: newBookingId, user_id: userId },
      });

      if (seat && seat.expiresAt > now) {
        return {
          status: false,
          message: "Some Error. Please try again later.",
        };
      }

      if (seat) {
        await prisma.booking.update({
          where: {
            booking_id_user_id: { booking_id: newBookingId, user_id: userId },
          },
          data: {
            user_id: userId,
            expiresAt,
            version: { increment: 1 },
          },
        });
      } else {
        await prisma.booking.create({
          data: {
            show_id: showId,
            user_id: userId,
            amount: showRecord.ticket_price,
            booking_id: newBookingId,
            expiresAt,
            version: 0,
          },
        });

        await prisma.show.update({
          where: { id: showId },
          data: { booked_seats: { increment: 1 } },
        });

        await prisma.user.update({
          where: { id: userId },
          data: { balance: { decrement: showRecord.ticket_price } },
        });
      }

      const balance = await prisma.user.findFirst({
        where: { id: userId },
        select: { balance: true },
      });

      return { status: true, message: "Booking successful", balance };
    });

    return c.json(result);
  } catch (error) {
    console.error("Error registering Booking:", error.message);
    return c.json({ message: error.message, status: false });
  } finally {
    await prisma.$disconnect();
  }
});

app.get("/user/show/:id", async (c) => {
  //works
  const prisma = new PrismaClient({
    datasources: {
      db: {
        url: c.env.DATABASE_URL,
      },
    },
  }).$extends(withAccelerate());
  const id = parseInt(c.req.param("id"));
  try {
    const show = await prisma.show.findFirst({
      where: {
        id: id,
      },
    });
    if (show) {
      return c.json(show);
    } else {
      return c.json({ message: "Show not found", status: false }, 404);
    }
  } catch (err) {
    console.log(err);
    return c.json(
      { message: "Error fetching show details", status: false },
      500
    );
  }
});

app.post("/user/placebid", async (c) => {
  //works
  const prisma = new PrismaClient({
    datasources: {
      db: {
        url: c.env.DATABASE_URL,
      },
    },
  }).$extends(withAccelerate());
  const body = await c.req.json();
  const bidderId = body.bidder_id;
  const bookingId = body.booking_id;
  const userId = body.user_id;
  const amount = parseInt(body.amount);
  let bidder = null;
  let booking = null;
  let bids = null;

  // Check if the booking is up for bidding
  try {
    booking = await prisma.booking.findFirst({
      where: {
        booking_id: bookingId,
        user_id: userId,
      },
    });
    if (booking.bidding === false) {
      return c.json({
        status: false,
        message: "Booking is not up for bidding.",
      });
    }
  } catch (error) {
    console.log(error);
    return c.json({ status: false, message: "Error fetching booking details" });
  }

  // Check if the amount the bidder is bidding is greater than the amount paid for booking
  if (booking.amount >= amount) {
    return c.json({
      status: false,
      message: "The bidding amount should be greater than the booking amount",
    });
  }

  // Check if the bidder has balance >= amount
  try {
    bidder = await prisma.user.findFirst({
      where: {
        id: bidderId,
      },
    });
    if (bidder.balance < amount) {
      return c.json({
        status: false,
        message: "Bidder doesn't have enough balance",
      });
    }
  } catch (error) {
    console.log(error);
    return c.json({ status: false, message: "Error fetching bidder details" });
  }

  // Check if the current max bid is lesser than the bidding amount
  try {
    bids = await prisma.bid.findMany({
      where: {
        booking_id: bookingId,
      },
    });
    bids.sort((a, b) => a.id - b.id);
    if (bids.length > 0 && bids[bids.length - 1].amount >= amount) {
      return c.json({
        status: false,
        message: "The amount must be greater than the current max bid amount",
      });
    } else if (bids.length === 0) {
      // Check if the bidding amount is greater than the actual ticket price
      try {
        const showId = booking.show_id;
        const show = await prisma.show.findFirst({
          where: {
            id: showId,
          },
        });
        if (show.ticket_price > amount) {
          return c.json({
            status: false,
            message: "The amount must be greater than the ticket price",
          });
        }
      } catch (error) {
        console.log(error);
        return c.json({
          status: false,
          message: "Error fetching show details",
        });
      }
    }
  } catch (error) {
    console.log(error);
    return c.json({
      status: false,
      message: "Error fetching previous bidding data for the booking",
    });
  }

  //check if the bidder had previously been of the same booking
  try {
    const res = await prisma.booking.findFirst({
      where: {
        user_id: bidderId,
        booking_id: bookingId,
      },
    });
    if (res) {
      return c.json({
        status: false,
        message: "you are not allowed to bid for this booking.",
      });
    }
  } catch (error) {
    return c.json({ status: false, message: "error fetching bidder details." });
  }

  // Register the bid
  try {
    await prisma.bid.create({
      data: {
        bidder_id: bidderId,
        booking_id: bookingId,
        booking_user_id: booking.user_id,
        amount: amount,
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
        return c.json({
          status: false,
          message: "Error updating last max bid status",
        });
      }
    }
    return c.json({ status: true, message: "Bid registered successfully" });
  } catch (error) {
    console.log(error);
    return c.json({ status: false, message: "Error registering the bid" });
  }
});

app.post("/user/postbid", async (c) => {
  //works
  const prisma = new PrismaClient({
    datasources: {
      db: {
        url: c.env.DATABASE_URL,
      },
    },
  }).$extends(withAccelerate());
  const body = await c.req.json();
  const userId = body.user_id;
  const bookingId = body.booking_id;
  let booking = null;

  // Check if the user is the owner of the booking
  try {
    booking = await prisma.booking.findFirst({
      where: {
        booking_id: bookingId,
        user_id: userId,
      },
    });
    if (!booking || booking.user_id !== userId) {
      return c.json({
        message: "The user is not the owner of the booking",
        status: false,
      });
    }
  } catch (error) {
    console.log(error);
    return c.json({ message: "Error fetching booking details", status: false });
  }

  // Post the booking for bidding
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
    return c.json({
      message: "Booking status updated successfully",
      status: true,
    });
  } catch (error) {
    console.log(error);
    return c.json({ status: false, message: "Error updating booking status" });
  }
});

app.post("/user/acceptbid", async (c) => {
  const prisma = new PrismaClient({
    datasources: {
      db: {
        url: c.env.DATABASE_URL,
      },
    },
  }).$extends(withAccelerate());

  const body = await c.req.json();
  const userId = body.user_id;
  const bookingId = body.booking_id;
  const now = new Date();
  const RESERVATION_TIME = 5 * 1000; // 5 seconds
  let userFinalBalance = 0;

  // Check if the userId is valid
  try {
    const user = await prisma.user.findFirst({
      where: { id: userId },
    });
    if (!user) {
      return c.json({
        status: false,
        message: "Error fetching user details/user doesn't exist",
      });
    }

    // Check if the bookingId is valid
    const currbooking = await prisma.booking.findFirst({
      where: { booking_id: bookingId, user_id: userId },
    });
    if (!currbooking) {
      return c.json({
        status: false,
        message: "Error fetching booking details/booking doesn't exist",
      });
    }

    // Check if the userId is the owner of the bookingId
    if (currbooking.user_id !== userId) {
      return c.json({
        status: false,
        message: "The user is not the owner of the booking",
      });
    }

    // Check if the booking is up for bidding
    if (!currbooking.bidding) {
      return c.json({
        status: false,
        message: "Booking is not up for bidding",
      });
    }

    // Check if there is any bid on the booking
    const bids = await prisma.bid.findMany({
      where: {
        booking_id: bookingId,
        booking_user_id: userId,
      },
    });
    bids.sort((a, b) => a.id - b.id);
    if (bids.length === 0) {
      return c.json({ status: false, message: "No bids on this booking" });
    }

    // Accept the latest bid
    const latestBid = bids[bids.length - 1];
    const latestBidUserId = latestBid.bidder_id;
    const latestBidAmount = latestBid.amount;

    await prisma.$transaction(async (prisma) => {
      // Update the bid status
      await prisma.bid.update({
        where: { id: latestBid.id },
        data: { status: "accepted" },
      });

      // Update the booking details
      await prisma.booking.update({
        where: {
          booking_id_user_id: { booking_id: bookingId, user_id: userId },
        },
        data: { status: "sold", bidding: false },
      });

      // Create a new booking for the bidder
      await prisma.booking.create({
        data: {
          booking_id: currbooking.booking_id,
          user_id: latestBidUserId,
          amount: latestBidAmount,
          show_id: currbooking.show_id,
          bidding: false,
          expiresAt: new Date(now.getTime() + RESERVATION_TIME),
        },
      });

      // Update bidder's balance
      const bidder = await prisma.user.findFirst({
        where: { id: latestBid.bidder_id },
      });
      const bidderNewBalance = bidder.balance - latestBid.amount;
      await prisma.user.update({
        where: { id: latestBid.bidder_id },
        data: { balance: bidderNewBalance },
      });

      // Update previous booking owner's balance
      const userNewBalance = user.balance + latestBid.amount;
      userFinalBalance = userNewBalance;
      await prisma.user.update({
        where: { id: userId },
        data: { balance: userNewBalance },
      });
    });

    return c.json({
      status: true,
      message: "Bid accepted successfully",
      balance: userFinalBalance,
    });
  } catch (error) {
    console.log(error);
    return c.json({ status: false, message: "Error accepting the bid" });
  }
});

///////////////////////////////////USER ROUTES//////////////////////////////////////

/////////////////////////////////////COMMON ROUTES/////////////////////////////////////
app.get("/common/bids/:id", async (c) => {
  //works
  const prisma = new PrismaClient({
    datasources: {
      db: {
        url: c.env.DATABASE_URL,
      },
    },
  }).$extends(withAccelerate());

  const id = parseInt(c.req.param("id")); // Use params to get ID from URL

  try {
    const bids = await prisma.bid.findMany({
      where: { bidder_id: id },
      orderBy: { id: "asc" }, // Order bids by ID ascending
    });

    // Return JSON response with bids
    return c.json(bids);
  } catch (err) {
    console.error("Error fetching bids:", err);
    // Return JSON response with error message
    return c.json({ status: false, message: "Error fetching bids" });
  } finally {
    // Disconnect Prisma client after use
    await prisma.$disconnect();
  }
});

app.get("/common/auctionbookings", async (c) => {
  //kinda works
  const prisma = new PrismaClient({
    datasources: {
      db: {
        url: c.env.DATABASE_URL,
      },
    },
  }).$extends(withAccelerate());

  try {
    const bookings = await prisma.booking.findMany({
      where: { bidding: true, status: "own" },
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

    const finalBookings = await Promise.all(
      bookings.map(async (booking) => {
        try {
          const bids = await prisma.bid.findMany({
            where: { booking_id: booking.booking_id, status: "pending" },
            orderBy: { id: "asc" }, // Ensure bids are ordered by ID ascending
          });

          if (bids.length === 0) {
            return { ...booking, highestBid: null };
          } else {
            const highestBidAmount = bids[bids.length - 1].amount;
            return { ...booking, highestBid: highestBidAmount };
          }
        } catch (err) {
          console.error(
            "Error fetching bid details for booking:",
            booking.booking_id,
            err
          );
          throw new Error("Failed to fetch bid details");
          // You may choose to handle the error differently based on your application's requirements
        }
      })
    );

    return c.json(finalBookings);
  } catch (err) {
    console.error("Error fetching bookings up for bidding:", err);
    return c.json({
      status: false,
      message: "Error fetching bookings up for bidding",
    });
  } finally {
    await prisma.$disconnect();
  }
});

app.get("/common/interest", async (c) => {
  //done
  const prisma = new PrismaClient({
    datasources: {
      db: {
        url: c.env.DATABASE_URL,
      },
    },
  }).$extends(withAccelerate());

  try {
    const interests = await prisma.interest.findMany();
    return c.json(interests, 200); // Respond with status 200 for successful request
  } catch (err) {
    console.error("Error fetching interests:", err);
    return c.json({ status: false, message: "Error fetching interests" }, 500); // Internal server error
  } finally {
    await prisma.$disconnect();
  }
});

app.get("/common/show/:id", async (c) => {
  //works
  const prisma = new PrismaClient({
    datasources: {
      db: {
        url: c.env.DATABASE_URL,
      },
    },
  }).$extends(withAccelerate());

  const id = parseInt(c.req.param("id")); // Correctly parse the route parameter

  if (isNaN(id)) {
    return c.json({ status: false, message: "Invalid show ID" }, 400); // Bad Request
  }

  try {
    const show = await prisma.show.findFirst({
      where: { id: id },
    });

    if (!show) {
      return c.json({ status: false, message: "Show not found" }, 404); // Not Found
    }

    try {
      const theatre = await prisma.theatre.findFirst({
        where: { id: show.theatre_id },
      });

      if (!theatre) {
        return c.json({ status: false, message: "Theatre not found" }, 404); // Not Found
      }

      return c.json({ show, theatre }, 200); // OK
    } catch (error) {
      console.error("Error fetching theatre details:", error);
      return c.json(
        { status: false, message: "Error fetching theatre details" },
        500
      ); // Internal Server Error
    }
  } catch (err) {
    console.error("Error fetching show details:", err);
    return c.json(
      { status: false, message: "Error fetching show details" },
      500
    ); // Internal Server Error
  } finally {
    await prisma.$disconnect();
  }
});

/////////////////////////////////////COMMON ROUTES/////////////////////////////////////

interface Show {
  id: number;
  booked_seats: number;
  total_seats: number;
  ticket_price: number;
  // Add other properties as needed based on your "Show" model
}

interface User {
  id: number;
  name: string;
  email: string;
  balance: number;
  // Add other properties as needed based on your "User" model
}

export default app;
