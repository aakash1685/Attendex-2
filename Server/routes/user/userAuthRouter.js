const express = require("express");
const router = express.Router();
const userProtect = require("../../middlewares/userAuthMiddleware");
const {
  loginController,
  changePasswordController,
  forgotPasswordController,
} = require("../../controllers/user/userAuthController");

router.post("/login", loginController);
router.patch("/change-password", userProtect, changePasswordController);

module.exports = router;
