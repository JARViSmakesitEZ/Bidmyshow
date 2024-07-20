const express = require("express");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const cors = require("cors");
const app = express();

const theatreRoutes = require("./theatre");
const userRoutes = require("./user");
const commonRoutes = require("./common");

app.use(express.json());
app.use(cors());

// Connect to PostgreSQL database

app.get("/", (req, res) => {
  res.send("hello world");
});

// Mount theatre routes
app.use("/theatre", theatreRoutes);

// Mount user routes
app.use("/user", userRoutes);

//Mount common routes
app.use("/common", commonRoutes);

const port = 3000;
app.listen(port, () => console.log("listening on port", port));
