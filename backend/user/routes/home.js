const express = require("express");
const router = express.Router();
const verifyToken = require("../../middleware/verifyToken");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const secretKey = "strawberriesncream";
const jwt = require("jsonwebtoken");

router.get("/home", verifyToken, async (req, res) => {
  console.log("hello from the home page");
  const token = req.header("authorization").split(" ")[1];
  let id;
  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Invalid token." });
    } else {
      id = decoded.id;
    }
  });
  try {
    const user = await prisma.user.findFirst({
      where: { id: id },
    });

    if (!user) {
      return res.status(404).send("User not found");
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

    res.send({
      user: { ...user, userinterests: userinterests.filter(Boolean) }, // Filter out null values
      shows: showsWithInterests,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal server error");
  }
});

module.exports = router;
