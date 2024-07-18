import { Hono } from "hono";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import jwt from "jsonwebtoken";
import { sign, verify } from "hono/jwt";
import { cors } from "hono/cors";

const app = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    SECRET_KEY: string;
  };
}>();


app.use("/*", async (c, next)=>{
  const token = c.req.header("authorization").split(" ") || "";
  const SECRET_KEY = c.env.SECRET_KEY;

  if (!token) {
    return c.json({ message: "Access denied. No token provided.",status:false });
  }

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) {
      return c.json({ message: "Invalid token.", status:false});
    }
    next();
  });
}


app.use("/*", cors());

app.get("/", (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());
  return c.text("Hello Hono!");
});

///////////////theatre routes/////////////////////////////
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
    return c.json({ message: "Error fetching show status.", status: false });
  }
});

app.post("/theatre/login", async (c) => {
  const SECRET_KEY = c.env.SECRET_KEY;
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());
  const { username, password } = await c.req.json(); // Parse JSON body from request

  if (!username || !password) {
    return c.json({
      message: "Username and password are required",
      status: false,
    });
  }

  try {
    const user = await prisma.theatre.findFirst({
      where: {
        name: username,
      },
    });

    if (!user || user.password !== password) {
      c.status;
      return c.json({ message: "Invalid username or password" });
    }

    const token = sign({ id: user.id, username: user.name }, SECRET_KEY);

    console.log(user);

    return c.json({ ...user, token });
  } catch (error) {
    console.error("Error during authentication:", error);
    return c.json({ message: "Internal server error" });
  }
});

app.post("/theatre/register", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());
  try {
    // Parse JSON body from request
    const body = await c.req.json();

    // Create a new theatre record using Prisma
    const theatre = await prisma.theatre.create({
      data: body,
    });

    console.log("New Theatre registered.");
    return c.text("Theatre registered successfully"); // Respond with text message
  } catch (error) {
    console.error("Error registering Theatre:", error);

    // Respond with an error message and set status code 500
    return c.json({ message: "Error registering Theatre", status: false });
  }
});

app.get("/theatre/home", (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());
  return c.text("Welcome to the home page!"); // Using c.text() to send a plain text response
});

//////////////theatre routes/////////////////////////////

////////////////////////user routes//////////////////////

app.get("/user/home", async (c) => {
  const SECRET_KEY = c.env.SECRET_KEY;
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());
  const token = c.req.header("authorization").split(" ")[1];
  let id;
  constverify(token, SECRET_KEY);
    if (err) {
      return c.json({ message: "Invalid token.", status: false });
    } else {
      id = decoded.id;
    }
  });
  try {
    const user = await prisma.user.findFirst({
      where: { id: id },
    });

    if (!user) {
      return c.json({ status: false, message: "User not found" });
    }

    const shows = await prisma.show.findMany();

    const userInterestsResult = await prisma.userInterests.findMany({
      where: { userId: user.id },
      select: { interestId: true },
    });

    const userinterestIds = userInterestsResult.map(
      (interest) => interest.interestId
    );

    const userinterests = await Promise.all(
      userinterestIds.map(async (id) => {
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

    c.json({
      user: { ...user, userinterests: userinterests.filter(Boolean) }, // Filter out null values
      shows: showsWithInterests,
    });
  } catch (error) {
    console.error("Error:", error);
    c.json({ message: "Internal server error", status: false });
  }
});

app.post("/user/login", async (c) => {
  const SECRET_KEY = c.env.SECRET_KEY;
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());
  const data = c.req.json;
  const email = data["email"];
  const password = data["password"];

  if (!email || !password) {
    return c.json({
      message: "Email and password both are required",
      status: false,
    });
  }

  try {
    const user = await prisma.user.findFirst({
      where: {
        email: email,
      },
    });

    if (!user) {
      return c.json({ message: "Invalid email or password", status: false });
    }

    const isPasswordValid = password === user.password;
    if (!isPasswordValid) {
      return c.json({ message: "Invalid email or password", status: false });
    }

    const token = sign({ id: user.id, email }, SECRET_KEY);

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
      return c.json({
        message: "Error fetching user interests.",
        status: false,
      });
    }

    const interests = interestsRes.map((i) => {
      return { id: i.interest.id, name: i.interest.name };
    });

    c.json({ ...user, token, interests });
  } catch (error) {
    console.error("Error during authentication:", error);
    c.json({ message: "Internal server error", status: false });
  }
});

app.post("/user/register", async (c) => {
  const SECRET_KEY = c.env.SECRET_KEY;
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());
  const body = await c.req.json();
  // const interests = body["interests"];
  const { interests, ...userData } = body;

  // Now userData contains all properties except 'interests'

  try {
    const user = await prisma.user.create({
      data: userData,
    });

    try {
      if (interests == null) {
        c.json({ message: "enter atleast 1 interest.", status: false });
        try {
          await prisma.user.delete({
            where: { id: user.id },
          });
          return;
        } catch (err) {
          c.json({ message: "error registering user.", status: false });
          return;
        }
        return;
      } else {
        interests.forEach(async (i) => {
          let interest;
          try {
            interest = await prisma.interest.findFirst({ where: { name: i } });
            try {
              const res = await prisma.userInterests.create({
                data: { userId: user.id, interestId: interest.id },
              });
            } catch (err) {
              c.json({
                status: false,
                message: "error creating user interest mapping.",
              });
              try {
                await prisma.user.delete({
                  where: { id: user.id },
                });
                return;
              } catch (err) {
                c.json({ message: "error registering user.", status: false });
                return;
              }
            }
          } catch (err) {
            c.json({ status: false, message: "error finding the interest." });
            try {
              await prisma.user.delete({
                where: { id: user.id },
              });
              return;
            } catch (err) {
              c.json({ message: "error registering user.", status: false });
              return;
            }
          }
        });
      }
    } catch (err) {
      c.json({ status: false, message: "error creating the user." });
      return;
    }

    c.json({ status: true, message: "User registered successfully" });
  } catch (error) {
    console.error("Error registering User:", error);

    // Respond with an error message
    c.json({ status: false, message: "Error registering User" });
  }
});

////////////////////////user routes//////////////////////

///////////////////////common routes////////////////////

app.get("/common/bids/:id", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());
  const id = parseInt(c.req.query["id"]);
  try {
    const bids = await prisma.bid.findMany({
      where: { bidder_id: id },
    });

    bids.sort((a, b) => a.id - b.id);
    c.json(bids);
    return;
  } catch (err) {
    c.json({ status: false, message: "error fetching bids" });
    console.log(err);
    return;
  }
});

app.get("/common/auctionbookings", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
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

    const finalbookings = await Promise.all(
      bookings.map(async (booking) => {
        try {
          let bids = await prisma.bid.findMany({
            where: { booking_id: booking.booking_id, status: "pending" },
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

    c.json(finalbookings);
    return;
  } catch (err) {
    c.json({
      status: false,
      message: "error fetching bookings up for bidding.",
    });
    console.log(err);
    return;
  }
});

app.get("/common/interest", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());
  try {
    const interests = await prisma.interest.findMany();
    c.json(interests);
    return;
  } catch (err) {
    c.json({ status: false, message: "error fetching interests" });
    return;
  }
});

app.get("/common/show/:id", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());
  const id = parseInt(c.req.query["id"]);
  try {
    let theatre;
    const show = await prisma.show.findFirst({
      where: { id: id },
    });
    try {
      const theatre_id = show.theatre_id;
      theatre = await prisma.theatre.findFirst({
        where: { id: theatre_id },
      });
    } catch (error) {
      c.json({ status: false, message: "error fetching theatre details" });
      return;
    }
    c.json({ show, theatre });
    return;
  } catch (err) {
    console.log(err);
    c.json({ status: false, message: "error fetching show details" });
    return;
  }
});

///////////////////////common routes////////////////////

//////////////////////functionalities////////////////////////
// const verifyToken = (req, res, next) => {
//   const token =
//     req.headers.authorization && req.headers.authorization.split(" ")[1];

//   if (!token) {
//     return res
//       .status(401)
//       .json({ message: "Access denied. No token provided." });
//   }

//   jwt.verify(token, SECRET_KEY, (err, decoded) => {
//     if (err) {
//       return res.status(401).json({ message: "Invalid token." });
//     }
//     next();
//   });
// };

///////////////////////////////////////////////////////////////

export default app;
