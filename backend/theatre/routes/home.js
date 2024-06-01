const express = require("express");
const router = express.Router();
const verifyToken = require("../../middleware/verifyToken");

router.get("/home", verifyToken, (req, res) => {
  res.send("Welcome to the home page!");
});

module.exports = router;
