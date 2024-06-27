const express = require("express");
const router = express.Router();
const verifyToken = require("../../middleware/verifyToken");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

router.get("/bids/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const bids = await prisma.bid.findMany({
      where: { bidder_id: id },
    });
    bids.sort((a, b) => a.id - b.id);
    res.send(bids);
    return;
  } catch (err) {
    res.send("error fetching bids");
    console.log(err);
    return;
  }
});

module.exports = router;
