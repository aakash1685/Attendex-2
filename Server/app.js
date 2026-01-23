const express = require("express");
const app = express();
const path = require("path");
const multer = require("multer");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/public", express.static(path.join(__dirname, "public")));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.get("/", (req,res) => {
    res.send("App is running");
})

const adminRoutes = require("./routes/admin");
app.use("/api/admin",adminRoutes);

module.exports = app;
