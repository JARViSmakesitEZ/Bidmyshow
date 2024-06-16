const express = require("express");
const router = express.Router();

// Import theatre routes
const registerRoute = require("./routes/register");
const loginRoute = require("./routes/login");
const homeRoute = require("./routes/home");
const registerShowRoute = require("./routes/functionalities/registershow");
const showStatusRoute = require("./routes/functionalities/showStatus");

// Use theatre routes
router.use(registerRoute);
router.use(loginRoute);
router.use(homeRoute);
router.use(registerShowRoute);
router.use(showStatusRoute);

module.exports = router;
