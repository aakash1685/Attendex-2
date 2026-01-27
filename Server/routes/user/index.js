const express = require("express");
const router = express.Router();

router.use("/auth", require("../../routes/user/userAuthRouter"));
router.use("/attendence", require("../../routes/user/userAttendenceRouter"));
router.use("/leaves", require("../../routes/user/userLeavesRouter"));

module.exports = router;
