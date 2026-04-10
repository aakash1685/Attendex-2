const express = require("express");
const router = express.Router();

const {
  getUserCalendarController,
  getUserMonthCalendarController,
} = require("../../controllers/user/UserCalendarController");
const userProtect =  require("../../middlewares/userAuthMiddleware");

// 🔹 Get Full Calendar
router.get("/",userProtect, getUserCalendarController);

// 🔹 Get Month Data
router.get("/month",userProtect, getUserMonthCalendarController);

module.exports = router;