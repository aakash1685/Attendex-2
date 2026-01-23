const express = require("express");
const app = express();
const path = require("path");
const multer = require("multer");

const adminRoutes = require("./routes/admin");
const userRoutes = require("./routes/user");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/public", express.static(path.join(__dirname, "public")));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.get("/", (req, res) => {
  res.send("App is running");
});

app.use("/api/admin", adminRoutes);
app.use("/api/user", userRoutes);

module.exports = app;
