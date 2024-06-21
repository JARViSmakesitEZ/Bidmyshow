const express = require("express");
const router = express.Router();

// Import theatre routes
const interestsRoute = require("./routes/interest");
const showRoute = require("./routes/show");
// Use theatre routes
router.use(interestsRoute);
router.use(showRoute);

module.exports = router;
