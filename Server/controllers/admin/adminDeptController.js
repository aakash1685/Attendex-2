const {
  getAllDeptService,
  getDeptByIdService,
  createDeptService,
  updateDeptService,
  toggleDeptStatusService
} = require("../../services/admin/adminDeptService");

const createDeptController = async (req, res) => {
  try {
    const { deptName } = req.body;
    const result = await createDeptService(deptName, req.admin);
    return res.status(result.status).json(result);
  } catch (error) {
    console.log("ERROR : ", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getAllDeptController = async (req, res) => {
  try {
    const result = await getAllDeptService(req.admin);
    return res.status(result.status).json({ result });
  } catch (error) {
    console.log("ERROR: ", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

const getDeptByIdController = async (req, res) => {
  try {
    const { deptId } = req.params;
    const result = await getDeptByIdService(deptId, req.admin);
    return res.status(result.status).json(result);
  } catch (error) {
    console.log("ERROR: ", error);
    return res.status(500).json({
      succeas: false,
      message: "Internal server error",
    });
  }
};

const updateDeptController = async (req, res) => {
  try {
    const { deptId } = req.params;

    const result = await updateDeptService(
      deptId,
      req.body,
      req.admin
    );

    return res.status(result.status).json(result);

  } catch (error) {
    console.log("ERROR: ", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const toggleDeptStatusController = async (req, res) => {
  try {
    const { deptId } = req.params;

    const result = await toggleDeptStatusService(deptId, req.admin);

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
  getAllDeptController,
  getDeptByIdController,
  createDeptController,
  updateDeptController,
  toggleDeptStatusController
};
