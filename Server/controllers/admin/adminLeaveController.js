const {
  getAllLeavesService,
  approveLeaveService,
  rejectLeaveService,
  deleteLeaveService,
  getLeavesByEmpService,
  getLeaveSummaryService,
} = require("../../services/admin/adminLeaveService");

const getAllLeavesController = async (req, res) => {
  try {
    const result = await getAllLeavesService(req.query, req.admin);
    return res.status(result.status).json(result);
  } catch (error) {
    console.log("ERROR: ", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const getLeavesByEmpController = async (req, res) => {
  try {
    const { empId } = req.params;
    const result = await getLeavesByEmpService(empId, req.query, req.admin);
    return res.status(result.status).json(result);
  } catch (error) {
    console.log("ERROR: ", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const approveLeaveController = async (req, res) => {
  try {
    const { leaveId } = req.params;
    const result = await approveLeaveService(leaveId, req.admin);
    return res.status(result.status).json(result);
  } catch (error) {
    console.log("ERROR: ", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const rejectLeaveController = async (req, res) => {
  try {
    const { leaveId } = req.params;
    const result = await rejectLeaveService(leaveId, req.admin);
    return res.status(result.status).json(result);
  } catch (error) {
    console.log("ERROR: ", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const deleteLeaveController = async (req, res) => {
  try {
    const { leaveId } = req.params;
    const result = await deleteLeaveService(leaveId, req.admin);
    return res.status(result.status).json(result);
  } catch (error) {
    console.log("ERROR: ", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const getLeaveSummaryController = async (req, res) => {
  try {
    const result = await getLeaveSummaryService(req.query, req.admin);
    return res.status(result.status).json(result);
  } catch (error) {
    console.log("ERROR: ", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

module.exports = {
  getAllLeavesController,
  approveLeaveController,
  rejectLeaveController,
  deleteLeaveController,
  getLeavesByEmpController,
  getLeaveSummaryController,
};
