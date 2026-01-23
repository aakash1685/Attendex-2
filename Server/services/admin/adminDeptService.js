const { status } = require("init");
const deptModel = require("../../models/deptModel");

const createDeptService = async (deptName, admin) => {
  if (!admin || admin.role !== "ADMIN") {
    return {
      success: false,
      status: 403,
      message: "Only Admin can Create Department",
    };
  }

  if (!deptName) {
    return {
      success: false,
      status: 403,
      message: "Department name is required!",
    };
  }

  const exsitingDept = await deptModel.findOne({ deptName });
  if (exsitingDept) {
    return res.status(403).json({
      success: false,
      status: 403,
      message: "Department already exists",
    });
  }

  const newDept = await deptModel.create({ deptName });
  return {
    success: true,
    status: 201,
    message: "New department created successfully",
    data: newDept,
  };
};

const getAllDeptService = async (admin) => {
  if (!admin || admin.role !== "ADMIN") {
    return {
      success: false,
      status: 403,
      message: "Only admin can access",
    };
  }

  const dept = await deptModel.find({ activeStatus: true });
  return {
    success: true,
    status: 200,
    message: "Departments fetched successfully",
    data: dept,
  };
};

const getDeptByIdService = async (deptId, admin) => {
  if (!admin || admin.role !== "ADMIN") {
    return {
      success: false,
      status: 403,
      message: "Only admin can access",
    };
  }

  const dept = await deptModel.findById(deptId);
  if (!dept) {
    return {
      success: false,
      status: 404,
      message: "Department not found",
    };
  }

  return {
    success: true,
    status: 200,
    message: "Department fetched",
    data: dept,
  };
};

const updateDeptService = async (deptId, data, admin) => {
  if (!admin || admin.role !== "ADMIN") {
    return {
      success: false,
      status: 404,
      message: "Only admin can access",
    };
  }

  const dept = await deptModel.findById(deptId);
  if (!dept) {
    return {
      success: false,
      status: 404,
      message: "Department not found!",
    };
  }

  if (!data.deptName) {
    return {
      success: true,
      status: 404,
      message: "Department name is required!",
    };
  }

  const updatedDept = await deptModel.findByIdAndUpdate(
    deptId,
    { $set: data },
    { new: true },
  );

  return {
    success: true,
    status: 200,
    message: "Department updated successfully!",
    updatedDept,
  };
};

const deactiveDeptService = async (deptId, admin) => {
  if (!admin || admin.role !== "ADMIN") {
    return {
      success: false,
      status: 403,
      message: "Only admin can access",
    };
  }

  await deptModel.findByIdAndUpdate(deptId, {
    activeStatus: false,
  });
  return {
    success: true,
    status: 200,
    message: "Department deactivated successfully",
  };
};

const activateDeptService = async (deptId, admin) => {
  if (!admin || admin.role !== "ADMIN") {
    return {
      success: false,
      status: 403,
      message: "Only admin can access",
    };
  }

  await deptModel.findByIdAndUpdate(deptId, {
    activeStatus: true,
  });
  return {
    success: true,
    status: 200,
    message: "Department activated successfully",
  };
};

module.exports = {
  getAllDeptService,
  getDeptByIdService,
  createDeptService,
  deactiveDeptService,
  updateDeptService,
  activateDeptService,
};
