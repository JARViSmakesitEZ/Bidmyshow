const express = require("express");
const router = express.Router();
const verifyToken = require("../../middleware/verifyToken");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

router.get("/interest", async (req, res) => {
  try {
    interests = await prisma.interest.findMany();
    res.send(interests);
    return;
  } catch (err) {
    res.send("error fetching interests");
    return;
  }
});

module.exports = router;
