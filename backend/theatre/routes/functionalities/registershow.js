const express = require("express");
const router = express.Router();
const verifyToken = require("../../../middleware/verifyToken.js");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

router.post("/registershow", async (req, res) => {
  const body = req.body;
  const { interests, ...showData } = body;
  try {
    const show = await prisma.show.create({
      data: showData,
    });

    try {
      if (interests == null) {
        res.send("enter atleast 1 interest.");
        await deleteShow(show.id);
        return;
      } else {
        interests.forEach(async (i) => {
          let interest;
          try {
            interest = await prisma.interest.findFirst({ where: { name: i } });
            try {
              const res = await prisma.showInterests.create({
                data: { showId: show.id, interestId: interest.id },
              });
            } catch (err) {
              res.send("error creating show interest mapping.");
              await deleteShow(show.id);
              return;
            }
          } catch (err) {
            res.send("error finding the interest.");
            await deleteShow(show.id);
            return;
          }
        });
      }
    } catch (err) {
      res.send("error creating the show.");
      return;
    }

    // console.log("New Show registered.");
    res.status(200).send("Show registered successfully");
  } catch (error) {
    console.error("Error registering Show:", error);

    // Respond with an error message
    res.status(500).send("Error registering Show");
  }
});

async function deleteShow(showId) {
  try {
    await prisma.show.delete({
      where: { id: showId },
    });
    return true;
  } catch (err) {
    return false;
  }
}

module.exports = router;
