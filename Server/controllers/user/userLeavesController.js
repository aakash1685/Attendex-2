const {
  applyLeaveService,
  getMyLeavesService,
  getSingleLeaveService,
  cancelLeaveService
} = require("../../services/user/userLeavesService");

const applyLeaveController = async (req, res) => {
  try {
    const result = await applyLeaveService(req.body, req.user);
    return res.status(result.status).json(result);
  } catch (error) {
    console.log("APPLY LEAVE ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const getMyLeavesController = async (req, res) => {
  try {
    const result = await getMyLeavesService(req.user, req.query);
    return res.status(result.status).json(result);
  } catch (error) {
    console.log("GET MY LEAVES ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const getSingleLeaveController = async (req, res) => {
  try {
    const result = await getSingleLeaveService(req.user, req.params.leaveId);
    return res.status(result.status).json(result);
  } catch (error) {
    console.log("GET SINGLE LEAVE ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const cancelLeaveController = async (req, res) => {
  try {
    const result = await cancelLeaveService(req.user, req.params.leaveId);
    return res.status(result.status).json(result);
  } catch (error) {
    console.log("CANCLE LEAVE ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

module.exports = {
  applyLeaveController,
  getMyLeavesController,
  getSingleLeaveController,
  cancelLeaveController
};
