const express = require("express");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const app = express();

const theatreRoutes = require("./theatre");
const userRoutes = require("./user");

app.use(express.json());

// Connect to PostgreSQL database

app.get("/", (req, res) => {
  res.send("hello world");
});

// Mount theatre routes
app.use("/theatre", theatreRoutes);

// Mount user routes
app.use("/user", userRoutes);

const port = 3000;
app.listen(port, () => console.log("listening on port", port));
