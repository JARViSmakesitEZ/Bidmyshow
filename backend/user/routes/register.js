const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

router.post("/register", async (req, res) => {
  const body = req.body;
  try {
    const theatre = await prisma.user.create({
      data: body,
    });

    console.log("New User registered.");
    res.status(200).send("User registered successfully");
  } catch (error) {
    console.error("Error registering User:", error);

    // Respond with an error message
    res.status(500).send("Error registering User");
  }
});

module.exports = router;
