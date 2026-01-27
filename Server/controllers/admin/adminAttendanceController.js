const {
  getAllAttendanceService,
} = require("../../services/admin/adminAttendanceService");

const getAllAttendanceController = async (req, res) => {
  try {
    const result = await getAllAttendanceService(req.query, req.admin);
    return res.status(result.status).json(result);
  } catch (error) {
    console.log("ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

module.exports = {
  getAllAttendanceController,
};
