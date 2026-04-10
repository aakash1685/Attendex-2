const express = require("express");
const router = express.Router();
const userProtect = require("../../middlewares/userAuthMiddleware");
const {
  loginController,
  changePasswordController,
  forgotPasswordController,
  resetPasswordController,
  getProfileController,
  getEmpCalendarController,
} = require("../../controllers/user/userAuthController");

router.post("/login", loginController);
router.get("/profile", userProtect, getProfileController);
router.patch("/change-password", userProtect, changePasswordController);
router.post("/forgot-password", forgotPasswordController);
router.post("/reset-password/:token", resetPasswordController);
router.get("/calendar", userProtect, getEmpCalendarController);


module.exports = router;
