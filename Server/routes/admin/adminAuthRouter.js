const express = require("express");
const router = express.Router();
const {adminLoginController} = require("../../controllers/admin/adminAuthController");

router.post("/", adminLoginController);

module.exports = router;