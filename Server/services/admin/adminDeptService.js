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

  const dept = await deptModel.find();
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
      status: 403, // ✅ FIXED
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

  if (!data.deptName || !data.deptName.trim()) {
    return {
      success: false, // ✅ FIXED
      status: 400,    // ✅ FIXED
      message: "Department name is required!",
    };
  }

  // ✅ Optional (best practice)
  const existing = await deptModel.findOne({
    deptName: data.deptName,
    _id: { $ne: deptId },
  });

  if (existing) {
    return {
      success: false,
      status: 409,
      message: "Department already exists",
    };
  }

  const updatedDept = await deptModel.findByIdAndUpdate(
    deptId,
    { $set: { deptName: data.deptName } },
    { new: true }
  );

  return {
    success: true,
    status: 200,
    message: "Department updated successfully!",
    data: updatedDept, // ✅ consistent naming
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

const toggleDeptStatusService = async (deptId, admin) => {
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

  // 🔥 Toggle logic
  dept.activeStatus = !dept.activeStatus;

  await dept.save();

  return {
    success: true,
    status: 200,
    message: `Department ${
      dept.activeStatus ? "activated" : "deactivated"
    } successfully`,
    data: dept,
  };
};

module.exports = {
  getAllDeptService,
  getDeptByIdService,
  createDeptService,
  deactiveDeptService,
  toggleDeptStatusService
};
