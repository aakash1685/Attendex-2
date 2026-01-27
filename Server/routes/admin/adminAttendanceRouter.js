const express = require("express");
const router = express.Router();
const adminProtect = require("../../middlewares/adminAuthMiddleware");
const { getAllAttendanceController } = require("../../controllers/admin/adminAttendanceController");

router.get("/", adminProtect, getAllAttendanceController)

module.exports = router;
