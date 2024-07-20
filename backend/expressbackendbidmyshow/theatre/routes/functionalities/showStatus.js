const express = require("express");
const verifyToken = require("../../../middleware/verifyToken.js");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

router.get("/showstatus/:id", async (req, res) => {
  const showId = req.params.id;
  const show = await prisma.show.findFirst({
    where: {
      id: parseInt(showId),
    },
  });
  res.send(show);
});

module.exports = router;
