const express = require("express");
const router = express.Router();

// Import theatre routes
const interestsRoute = require("./routes/interest");
const showRoute = require("./routes/show");
const bidsRoute = require("./routes/bids");
const auctionBookingsRoute = require("./routes/auctionbookings");
// Use theatre routes
router.use(interestsRoute);
router.use(showRoute);
router.use(bidsRoute);
router.use(auctionBookingsRoute);

module.exports = router;
