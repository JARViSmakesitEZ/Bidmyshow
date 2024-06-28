const express = require("express");
const router = express.Router();
const verifyToken = require("../../middleware/verifyToken");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

router.get("/show/:id", async (req, res) => {
  const id = parseInt(req.params.id);
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
      res.send("error fetching theatre details");
      return;
    }
    res.send({ show, theatre });
    return;
  } catch (err) {
    console.log(err);
    res.send("error fetching show details");
    return;
  }
});

module.exports = router;
