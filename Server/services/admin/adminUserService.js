const bcrypt = require("bcrypt");
const userModel = require("../../models/userModel");
const deptModel = require("../../models/deptModel");
const desigModel = require("../../models/desigModel");

const createUserService = async (data, admin) => {
  if (!admin || admin.role !== "ADMIN") {
    return {
      success: false,
      status: 403,
      message: "Only admin can create users!",
    };
  }

  const existingUser = await userModel.findOne({
    $or: [{ email: data.email }, { mobileNo: data.mobileNo }],
  });

  if (existingUser) {
    return {
      success: false,
      status: 400,
      message: "Employee already created",
    };
  }

  const rawPassword = `${data.name.replace(/\s/g, "").toLowerCase()}@123`;
  const hashedPassword = await bcrypt.hash(rawPassword, 10);

  const user = await userModel.create({
    ...data,
    password: hashedPassword,
  });

  return {
    success: true,
    status: 201,
    message: "Employee Created Successsfully!",
    data: {
      id: user._id,
      email: user.email,
      mobileNo: user.mobileNo,
      password: rawPassword,
    },
  };
};

const editUserService = async (userId, data, admin) => {
  if (!admin || admin.role !== "ADMIN") {
    return {
      success: false,
      status: 403,
      message: "Only admin can create users!",
    };
  }

  const user = await userModel.findById(userId);
  if (!user) {
    return {
      success: false,
      status: 404,
      message: "Employee not found",
    };
  }

  delete data.password;

  const updateUser = await userModel.findByIdAndUpdate(
    userId,
    { $set: data },
    { new: true },
  );

  return {
    success: true,
    status: 200,
    message: "Employee Updated Successfully",
    data: updateUser,
  };
};

const deactiveUserService = async (userId, admin) => {
  if (!admin || admin.role !== "ADMIN") {
    return {
      success: false,
      status: 403,
      message: "Only Admin can Deactivate Employee",
    };
  }

  await userModel.findByIdAndUpdate(userId, {
    activeStatus: false,
  });

  return {
    success: true,
    status: 200,
    message: "Employee Deactivated successfully",
  };
};

const getAllUsersService = async (admin) => {
  if (!admin || admin.role !== "ADMIN") {
    return {
      success: false,
      status: 403,
      message: "Admin only",
    };
  }

  const employees = await userModel
    .find({ activeStatus: true })
    .select("-password")
    .populate("dept", "deptName")
    .populate("designation", "desigName");

  return {
    success: true,
    status: 200,
    message: "Employees fetched successfully!",
    employees,
  };
};

const getAllDeactiveUsersService = async (admin) => {
  if (!admin || admin.role !== "ADMIN") {
    return {
      success: false,
      status: 403,
      message: "Admin only",
    };
  }

  const employees = await userModel
    .find({ activeStatus: false })
    .select("-password")
    .populate("dept", "deptName")
    .populate("designation", "desigName");

  return {
    success: true,
    status: 200,
    message: "All Deactivated Employees fetched successfully!",
    employees,
  };
};

module.exports = {
  createUserService,
  editUserService,
  deactiveUserService,
  getAllUsersService,
  getAllDeactiveUsersService,
};
