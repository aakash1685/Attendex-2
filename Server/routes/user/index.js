const express = require("express");
const router = express.Router();

router.use("/auth", require("../../routes/user/userAuthRouter"));
router.use("/attendence", require("../../routes/user/userAttendenceRouter"));
router.use("/leave", require("../../routes/user/userLeavesRouter"));
router.use("/calendar", require("../../routes/user/UserCalendarRouter"));

module.exports = router;
