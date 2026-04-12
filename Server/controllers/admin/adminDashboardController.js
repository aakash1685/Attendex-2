const { getAdminDashboardOverviewService } = require("../../services/admin/adminDashboardService");

const getAdminDashboardOverviewController = async (req, res) => {
  try {
    const result = await getAdminDashboardOverviewService(req.admin);
    return res.status(result.status).json(result);
  } catch (error) {
    console.log("ADMIN DASHBOARD OVERVIEW ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

module.exports = {
  getAdminDashboardOverviewController,
};
