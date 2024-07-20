const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

router.post("/register", async (req, res) => {
  const body = req.body;
  try {
    const theatre = await prisma.theatre.create({
      data: body,
    });

    console.log("New Theatre registered.");
    res.status(200).send("Theatre registered successfully");
  } catch (error) {
    console.error("Error registering Theatre:", error);

    // Respond with an error message
    res.status(500).send("Error registering Theatre");
  }
});

module.exports = router;
