const express = require("express");
const router = express.Router();
const verifyToken = require("../../../middleware/verifyToken.js");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

router.post("/registershow", async (req, res) => {
  const body = req.body;
  try {
    const show = await prisma.show.create({
      data: body,
    });

    console.log("New Show registered.");
    res.status(200).send("Show registered successfully");
  } catch (error) {
    console.error("Error registering Show:", error);

    // Respond with an error message
    res.status(500).send("Error registering Show");
  }
});

module.exports = router;
