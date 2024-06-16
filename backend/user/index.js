const express = require("express");
const router = express.Router();
// Import user routes
const registerRoute = require("./routes/register");
const loginRoute = require("./routes/login");
const homeRoute = require("./routes/home");
const bookingRoute = require("./routes/functionalities/booking");
const placeBidRoute = require("./routes/functionalities/placeBid");
const postBidRoute = require("./routes/functionalities/postBid");
const acceptBidRoute = require("./routes/functionalities/acceptBid");
const getShowRoute = require("./routes/functionalities/getShow");

// Use user routes
router.use(registerRoute);
router.use(loginRoute);
router.use(homeRoute);
router.use(bookingRoute);
router.use(placeBidRoute);
router.use(postBidRoute);
router.use(acceptBidRoute);
router.use(getShowRoute);

module.exports = router;
