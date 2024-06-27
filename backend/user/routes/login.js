const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const secretKey = "strawberriesncream";
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

console.log(secretKey);

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  console.log(req.body);

  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Email and password both are required" });
  }

  try {
    const user = await prisma.user.findFirst({
      where: {
        email: email,
      },
    });
    console.log(user);

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isPasswordValid = password === user.password;
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign({ id: user.id, email }, secretKey, {
      expiresIn: "1h",
    });

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
      return res
        .status(500)
        .json({ message: "Error fetching user interests." });
    }

    const interests = interestsRes.map((i) => {
      return { id: i.interest.id, name: i.interest.name };
    });

    res.json({ ...user, token, interests });
  } catch (error) {
    console.error("Error during authentication:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
