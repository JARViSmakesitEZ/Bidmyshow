const express = require("express");
const router = express.Router();

// Import user routes
const registerRoute = require("./routes/register");
const loginRoute = require("./routes/login");
const homeRoute = require("./routes/home");
const bookingRoute = require("./routes/functionalities/booking");

// Use user routes
router.use(registerRoute);
router.use(loginRoute);
router.use(homeRoute);
router.use(bookingRoute);

module.exports = router;
