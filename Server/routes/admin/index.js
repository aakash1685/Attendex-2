const express = require("express");
const router = express.Router();

router.use("/auth", require("../../routes/admin/adminAuthRouter"));
router.use("/user", require("../../routes/admin/adminUserRouter"));
router.use("/dept", require("../../routes/admin/adminDeptRouter"));
router.use("/desig", require("../../routes/admin/adminDesigRouter"));
router.use("/dept-calendar", require("../../routes/admin/adminDeptCalendarRouter"));
router.use("/leaves", require("../../routes/admin/adminLeaveRouter"));
// router.use("/attendence", require("../../routes/admin/adminAttendenceRouter"));

module.exports = router;
