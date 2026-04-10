const express = require("express");
const router = express.Router();

router.use("/auth", require("./adminAuthRouter"));
router.use("/user", require("./adminUserRouter"));
router.use("/dept", require("./adminDeptRouter"));
router.use("/desig", require("./adminDesigRouter"));
router.use("/dept-calendar", require("./adminDeptCalendarRouter"));
router.use("/leave", require("./adminLeaveRouter"));
router.use("/attendance", require("./adminAttendanceRouter"));

module.exports = router;
