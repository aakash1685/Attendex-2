const express = require("express");
const router = express.Router();
const adminProtect = require("../../middlewares/adminAuthMiddleware");
const { getAdminDashboardOverviewController } = require("../../controllers/admin/adminDashboardController");

router.get("/overview", adminProtect, getAdminDashboardOverviewController);

module.exports = router;
