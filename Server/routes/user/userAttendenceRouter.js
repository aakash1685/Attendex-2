const express = require("express");
const router = express.Router();
const {
    checkInController
} = require("../../controllers/user/userAttendenceController");

router.post("/check-in", checkInController);


module.exports = router;
