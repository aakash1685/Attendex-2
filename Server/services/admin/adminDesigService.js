const { status } = require("init");
const desigModel = require("../../models/desigModel");
const adminCheck = require("../../utils/adminCheck");

const createDesigService = async (data, admin) => {
  const { desigName, dept } = data;
  const check = adminCheck(admin);
  if (check) return check;

  if (!desigName || !dept) {
    return {
      status: 403,
      success: false,
      message: "All fields are required!",
    };
  }

  const existDesig = await desigModel.findOne({ desigName, dept });
  if (existDesig) {
    return {
      status: 403,
      success: false,
      message: "Designation already exist",
    };
  }

  const newDesig = await desigModel.create({
    desigName,
    dept,
  });

  return {
    status: 201,
    success: false,
    message: "New designation added successfully!",
  };
};

const getAllDesigService = async (admin) => {
  const check = adminCheck(admin);
  if (check) return check;

  const allDesig = await desigModel.find();
  return {
    status: 201,
    success: true,
    message: "All designation fetched",
    allDesig,
  };
};

const getDesigByDeptService = async (deptId, admin) => {
  const check = adminCheck(admin);
  if (check) return check;

  if (!deptId) {
    return {
      status: 403,
      success: false,
      message: "Department id is required!",
    };
  }

  const desigs = await desigModel.find({
    dept: deptId,
    activeStatus: true,
  });

  return {
    status: 200,
    success: true,
    message: "Designations fetched successfully",
    data: desigs,
  };
};

const updateDesigService = async (data, admin) => {
  const { desigId, desigName, dept } = data;

  const check = adminCheck(admin);
  if (check) return check;

  if (!desigId || !desigName || !dept) {
    return {
      status: 400,
      success: false,
      message: "All fields are required!",
    };
  }

  const desigExists = await desigModel.findById(desigId);
  if (!desigExists) {
    return {
      status: 404,
      success: false,
      message: "Designation not found!",
    };
  }

  const duplicateDesig = await desigModel.findOne({
    desigName,
    dept,
    _id: { $ne: desigId },
  });

  if (duplicateDesig) {
    return {
      status: 409,
      success: false,
      message: "Designation already exists in this department",
    };
  }

  const updatedDesig = await desigModel.findByIdAndUpdate(
    desigId,
    { desigName, dept },
    { new: true },
  );

  return {
    success: true,
    status: 200,
    message: "Designation updated successfully!",
    data: updatedDesig,
  };
};

const activateDesigService = async (desigId, admin) => {
  const check = adminCheck(admin);
  if (check) return check;

  if (!desigId) {
    return {
      status: 403,
      success: false,
      message: "Designation id is required",
    };
  }

  const desig = await desigModel.findById(desigId);
  if (!desig) {
    return {
      status: 404,
      success: false,
      message: "Designation not found",
    };
  }

  const activateDesig = await desigModel.findByIdAndUpdate(desigId, {
    activeStatus: true,
  });

  return {
    success: true,
    status: 200,
    message: "Designation activated successfully!",
    activateDesig,
  };
};

const deActivateDesigService = async (desigId, admin) => {
  const check = adminCheck(admin);
  if (check) return check;

  if (!desigId) {
    return {
      status: 403,
      success: false,
      message: "Designation id is required",
    };
  }

  const desig = await desigModel.findById(desigId);
  if (!desig) {
    return {
      status: 404,
      success: false,
      message: "Designation not found",
    };
  }

  const deActivateDesig = await desigModel.findByIdAndUpdate(desigId, {
    activeStatus: false,
  });

  return {
    success: true,
    status: 200,
    message: "Designation de-activated successfully!",
    deActivateDesig,
  };
};

module.exports = {
  createDesigService,
  getAllDesigService,
  getDesigByDeptService,
  updateDesigService,
  activateDesigService,
  deActivateDesigService,
};
