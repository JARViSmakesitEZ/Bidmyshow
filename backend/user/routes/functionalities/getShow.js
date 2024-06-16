const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

router.get("/show/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const show = await prisma.show.findFirst({
      where: {
        id: id,
      },
    });
    res.send(show);
  } catch (err) {
    res.send("error fetching show details");
    console.log(err);
    return;
  }
});

module.exports = router;
