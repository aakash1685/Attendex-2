const mongoose = require("mongoose");
const leavesModel = require("../../models/leavesModel");
const adminCheck = require("../../utils/adminCheck");

//GET ALL LEAVES
const getAllLeavesService = async (query, admin) => {
  const check = adminCheck(admin);
  if (check) return check;

  const { deptId, leaveStatus, fromDate, toDate } = query;

  const filter = {};

  if (deptId) filter.deptId = new mongoose.Types.ObjectId(deptId);
  if (leaveStatus) filter.leaveStatus = leaveStatus.toUpperCase();

  if (fromDate || toDate) {
    filter.startDate = {};
    if (fromDate) filter.startDate.$gte = new Date(fromDate);
    if (toDate) filter.startDate.$lte = new Date(toDate);
  }

  const leaves = await leavesModel
    .find(filter)
    .populate("empId", "name email")
    .populate("deptId", "name")
    .sort({ createdAt: -1 });

  if (leaves.length === 0) {
    return {
      success: false,
      status: 404,
      message: "No leaves found",
      totalLeaves: 0,
      leaves: [],
    };
  }

  return {
    status: 200,
    success: true,
    message: "Leaves fetched Successfully! ",
    totalLeaves: leaves.length,
    leaves,
  };
};

//GET LEAVES BY EMPLOYEE
const getLeavesByEmpService = async (empId, query, admin) => {
  const check = adminCheck(admin);
  if (check) return check;

  const { leaveStatus, fromDate, toDate } = query;

  const filter = {
    empId: new mongoose.Types.ObjectId(empId),
  };

  if (leaveStatus) filter.leaveStatus = leaveStatus.toUpperCase();

  if (fromDate || toDate) {
    filter.startDate = {};
    if (fromDate) filter.startDate.$gte = new Date(fromDate);
    if (toDate) filter.startDate.$lte = new Date(toDate);
  }

  const leaves = await leavesModel
    .find(filter)
    .populate("empId", "name email")
    .populate("deptId", "name")
    .sort({ createdAt: -1 });

  if (!leaves.length) {
    return {
      status: 404,
      success: false,
      message: "No leaves found for this employee",
      totalLeaves: 0,
      leaves: [],
    };
  }

  return {
    status: 200,
    success: true,
    message: "leaves fetched successfully! ",
    totalLeaves: leaves.length,
    leaves,
  };
};

//TO APPROVE LEAVES
const approveLeaveService = async (leaveId, admin) => {
  const check = adminCheck(admin);
  if (check) return check;

  const leave = await leavesModel.findById(leaveId);

  if (!leave) {
    return {
      status: 404,
      success: false,
      message: "Leave not found",
    };
  }

  if (leave.leaveStatus !== "PENDING") {
    return {
      status: 400,
      success: false,
      message: "Only PENDING leave can be approved",
    };
  }

  leave.leaveStatus = "APPROVED";
  await leave.save();

  return {
    status: 200,
    success: true,
    message: "Leave approved successfully",
    data: leave,
  };
};

//TO REJECT LEAVES
const rejectLeaveService = async (leaveId, admin) => {
  const check = adminCheck(admin);
  if (check) return check;

  const leave = await leavesModel.findById(leaveId);

  if (!leave) {
    return {
      status: 404,
      success: false,
      message: "Leave not found",
    };
  }

  if (leave.leaveStatus !== "PENDING") {
    return {
      status: 400,
      success: false,
      message: "Only PENDING leave can be approved",
    };
  }

  leave.leaveStatus = "REJECTED";
  await leave.save();

  return {
    status: 200,
    success: true,
    message: "Leave rejected successfully",
    data: leave,
  };
};

//DELETE LEAVE
const deleteLeaveService = async (leaveId, admin) => {
  const check = adminCheck(admin);
  if (check) return check;

  const deletedLeave = await leavesModel.findByIdAndDelete(leaveId);

  return {
    status: 200,
    success: true,
    message: "Leave deleted successfully",
  };
};

//GET LEAVE SUMMARY
const getLeaveSummaryService = async (query, admin) => {
  const check = adminCheck(admin);
  if (check) return check;

  const { year, month, deptId } = query;

  const match = {};

  if (deptId) match.deptId = new mongoose.Types.ObjectId(deptId);

  //TO GET SUMMARY BY YEAR INCLUDES MONTH PROVIDED OR NOT
  if (year) {
    const start = new Date(year, month ? month - 1 : 0, 1);
    const end = month
      ? new Date(year, month, 0, 23, 59, 59)
      : new Date(year, 11, 23, 59, 59);

    match.startDate = { $gte: start, $lte: end };
  }

  const summary = await leavesModel.aggregate([
    { $match: match },
    {
      $group: {
        _id: "$leaveStatus",
        count: { $sum: 1 },
      },
    },
  ]);

  const result = {
    total: 0,
    APPROVED: 0,
    REJECTED: 0,
    PENDING: 0,
  };

  summary.forEach((s) => {
    result[s._id] = s.count;
    result.total += s.count;
  });

  return {
    success: true,
    status: 200,
    message: "Leave summary fetched successfully",
    data: result,
  };
};

module.exports = {
  getAllLeavesService,
  approveLeaveService,
  rejectLeaveService,
  deleteLeaveService,
  getLeavesByEmpService,
  getLeaveSummaryService,
};
