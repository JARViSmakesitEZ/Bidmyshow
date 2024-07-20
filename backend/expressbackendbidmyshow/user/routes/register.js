const express = require("express");
const router = express.Router();
// const verifyToken = require("../../../middleware/verifyToken.js");

const { PrismaClient } = require("@prisma/client");

router.post("/register", async (req, res) => {
  const body = req.body;
  const { interests, ...userData } = body;
  try {
    const user = await prisma.user.create({
      data: userData,
    });

    try {
      if (interests == null) {
        res.send("enter atleast 1 interest.");
        await deleteUser(user.id);
        return;
      } else {
        interests.forEach(async (i) => {
          let interest;
          try {
            interest = await prisma.interest.findFirst({ where: { name: i } });
            try {
              const res = await prisma.userInterests.create({
                data: { userId: user.id, interestId: interest.id },
              });
            } catch (err) {
              res.send("error creating user interest mapping.");
              await deleteUser(user.id);
              return;
            }
          } catch (err) {
            res.send("error finding the interest.");
            await deleteUser(user.id);
            return;
          }
        });
      }
    } catch (err) {
      res.send("error creating the user.");
      return;
    }

    res.status(200).send("User registered successfully");
  } catch (error) {
    console.error("Error registering User:", error);

    // Respond with an error message
    res.status(500).send("Error registering User");
  }
});

async function deleteUser(userId) {
  try {
    await prisma.user.delete({
      where: { id: userId },
    });
    return true;
  } catch (err) {
    return false;
  }
}

module.exports = router;
