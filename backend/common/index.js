const express = require("express");
const router = express.Router();

// Import theatre routes
const interestsRoute = require("./routes/interest");

// Use theatre routes
router.use(interestsRoute);

module.exports = router;
