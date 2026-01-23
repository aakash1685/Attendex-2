const express = require("express");
const router = express.Router();
const adminProtect = require("../../middlewares/adminAuthMiddleware");
const {
  loginController,
  logoutController,
} = require("../../controllers/admin/adminAuthController");

router.post("/", loginController);
router.post("/logout", adminProtect, logoutController);

module.exports = router;
