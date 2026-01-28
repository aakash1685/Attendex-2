const {
  getAllAttendanceService,
  getAllAttendanceByEmpService,
  getAllAttendanceByDeptService,
  getAttendanceSummaryService,
  updateAttendanceService,
  mannualAttendanceService,
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

const getAllAttendanceByEmpController = async (req, res) => {
  try {
    const query = req.query;
    const { empId } = req.params;
    const result = await getAllAttendanceByEmpService(query, empId, req.admin);
    return res.status(result.status).json(result);
  } catch (error) {
    console.log("ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const getAllAttendanceByDeptController = async (req, res) => {
  try {
    const { deptId } = req.params;
    const result = await getAllAttendanceByDeptService(
      deptId,
      req.query,
      req.admin,
    );
    return res.status(result.status).json(result);
  } catch (error) {
    console.log("ADMIN DEPT ATTENDANCE ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const getAttendanceSummaryController = async (req, res) => {
  try {
    const result = await getAttendanceSummaryService(req.query, req.admin);
    return res.status(result.status).json(result);
  } catch (error) {
    console.log("ATTENDANCE SUMMARY ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const updateAttendanceController = async (req, res) => {
  try {
    const { attendanceId } = req.params;
    const result = await updateAttendanceService(
      attendanceId,
      req.body,
      req.admin,
    );
    return res.status(result.status).json(result);
  } catch (error) {
    console.log("UPDATE ATTENDANCE ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const mannualAttendanceController = async (req, res) => {
  try {
    const result = await mannualAttendanceService(req.body, req.admin);
    return res.status(result.status).json(result);
  } catch (error) {
    console.log("MANUAL ATTENDANCE ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

module.exports = {
  getAllAttendanceController,
  getAllAttendanceByEmpController,
  getAllAttendanceByDeptController,
  getAttendanceSummaryController,
  updateAttendanceController,
  mannualAttendanceController,
};
