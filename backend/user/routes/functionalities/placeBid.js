const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

router.post("/placebid", async (req, res) => {
  body = req.body;
});

module.exports = router;
