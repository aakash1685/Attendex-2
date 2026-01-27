const express = require("express");
const router = express.Router();
const userProtect =  require("../../middlewares/userAuthMiddleware");
const {
    checkInController,
    checkOutController
} = require("../../controllers/user/userAttendenceController");

router.post("/check-in",userProtect,  checkInController);
router.post("/check-out", userProtect, checkOutController);


module.exports = router;
