const {
  createDesigService,
  getAllDesigService,
  getDesigByDeptService,
  updateDesigService,
  activateDesigService,
  deActivateDesigService,
} = require("../../services/admin/adminDesigService");

const createDesigController = async (req, res) => {
  try {
    const { desigName, dept } = req.body;
    const data = { desigName, dept };
    const result = await createDesigService(data, req.admin);
    return res.status(result.status).json(result);
  } catch (error) {
    console.log("ERROR IN CREATE DESIG CONTROLLER: ", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const getAllDesigController = async (req, res) => {
  try {
    const result = await getAllDesigService(req.admin);
    return res.status(result.status).json(result);
  } catch (error) {
    console.log("ERROR IN GET ALL DESIG CONTROLLER: ", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const getDesigByDeptController = async (req, res) => {
  try {
    const { deptId } = req.params;
    const result = await getDesigByDeptService(deptId, req.admin);
    return res.status(result.status).json(result);
  } catch (error) {
    console.log("ERROR IN GET DESIG BY DEPT CONTROLLER: ", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const updateDesigController = async (req, res) => {
  try {
    const { desigId } = req.params;
    const data = {
      desigId,
      desigName: req.body.desigName,
      dept: req.body.dept,
    };
    const result = await updateDesigService(data, req.admin);
    return res.status(result.status).json(result);
  } catch (error) {
    console.log("ERROR IN UPDATE DESIG CONTROLLER: ", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const activateDesigController = async (req, res) => {
  try {
    const { desigId } = req.params;
    const result = await activateDesigService(desigId, req.admin);
    return res.status(result.status).json(result);
  } catch (error) {
    console.log("ERROR IN ACTIVATE DESIG CONTROLLER: ", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const deActivateDesigController = async (req, res) => {
  try {
    const { desigId } = req.params;
    const result = await deActivateDesigService(desigId, req.admin);
    return res.status(result.status).json(result);
  } catch (error) {
    console.log("ERROR IN DEACTIVATE DESIG CONTROLLER: ", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

module.exports = {
  createDesigController,
  getAllDesigController,
  getDesigByDeptController,
  updateDesigController,
  activateDesigController,
  deActivateDesigController,
};
