const leaveModel = require("../../models/leavesModel");
const leaveBalanceModel = require("../../models/leavesBalanceModel");
const mongoose = require("mongoose");

const applyLeaveService = async (body, user) => {
  const { reason, leaveDates, leaveType } = body;

  // ✅ Basic Validation
  if (
    !reason ||
    !leaveDates ||
    !leaveType ||
    !Array.isArray(leaveDates) ||
    leaveDates.length === 0
  ) {
    return {
      status: 400,
      success: false,
      message: "Reason, leave type and leave dates are required",
    };
  }

  // ✅ Validate leaveType
  const validTypes = ["CL", "SL", "PL", "LOP"];
  if (!validTypes.includes(leaveType)) {
    return {
      status: 400,
      success: false,
      message: "Invalid leave type",
    };
  }

  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);

  for (const d of leaveDates) {
    const date = new Date(d);
    date.setUTCHours(0, 0, 0, 0);

    if (date <= today) {
      return {
        status: 400,
        success: false,
        message: "Past or today leave dates are not allowed",
      };
    }
  }

  // ✅ Normalize & Sort
  const normalizedDates = leaveDates
    .map((d) => {
      const date = new Date(d);
      date.setUTCHours(0, 0, 0, 0);
      return date;
    })
    .sort((a, b) => a - b);

  const startDate = normalizedDates[0];
  const endDate = normalizedDates[normalizedDates.length - 1];
  const totalDays = normalizedDates.length;

  // ✅ Check overlapping leave
  const existingLeave = await leaveModel.findOne({
    empId: user._id,
    leaveDates: { $in: normalizedDates },
    leaveStatus: { $ne: "REJECTED" },
  });

  if (existingLeave) {
    return {
      status: 409,
      success: false,
      message: "Leave already exists for one or more selected dates",
    };
  }

  // ✅ Check Leave Balance (except LOP)
// ✅ Check Leave Balance (except LOP)
if (leaveType !== "LOP") {

  let balance = await leaveBalanceModel.findOne({ empId: user._id });

  // 🔥 PLACE FIX HERE (AUTO CREATE)
  if (!balance) {
    balance = await leaveBalanceModel.create({
      empId: user._id,
      CL: { total: 6, used: 0, remaining: 6 },
      SL: { total: 6, used: 0, remaining: 6 },
      PL: { total: 12, used: 0, remaining: 12 }
    });
  }

  if (balance[leaveType].remaining < totalDays) {
    return {
      status: 400,
      success: false,
      message: `Not enough ${leaveType} balance`,
    };
  }
}
  // ✅ Create Leave
  const leave = await leaveModel.create({
    empId: user._id,
    deptId: user.dept,
    leaveType: leaveType,
    reason,
    leaveDates: normalizedDates,
    startDate,
    endDate,
    totalDays,
    leaveStatus: "PENDING",
  });

  return {
    status: 201,
    success: true,
    message: "Leave applied successfully",
    data: leave,
  };
};

const getMyLeavesService = async (user, query) => {
  const { status, fromDate, toDate, month, year } = query;

  const filter = {
    empId: user._id,
  };

  if (status) {
    const allowedStatus = ["PENDING", "APPROVED", "REJECTED"];
    if (!allowedStatus.includes(status.toUpperCase())) {
      return {
        status: 400,
        success: false,
        message: "Invalid leave status",
      };
    }
    filter.leaveStatus = status.toUpperCase();
  }

  if (fromDate && isNaN(new Date(fromDate))) {
    return {
      status: 400,
      success: false,
      message: "Invalid fromDate",
    };
  }

  if (toDate && isNaN(new Date(toDate))) {
    return {
      status: 400,
      success: false,
      message: "Invalid toDate",
    };
  }

  if (fromDate && toDate && new Date(fromDate) > new Date(toDate)) {
    return {
      status: 400,
      success: false,
      message: "fromDate cannot be greater than toDate",
    };
  }

  if (year && (isNaN(year) || year < 2000)) {
    return {
      status: 400,
      success: false,
      message: "Invalid year",
    };
  }

  if (month && (isNaN(month) || month < 1 || month > 12)) {
    return {
      status: 400,
      success: false,
      message: "Invalid month",
    };
  }

  if ((fromDate || toDate) && (year || month)) {
    return {
      status: 400,
      success: false,
      message: "Use either date range OR year/month filter",
    };
  }

  //DATE FILTER
  if (fromDate || toDate) {
    filter.startDate = {};
    if (fromDate) filter.startDate.$gte = new Date(fromDate);
    if (toDate) filter.startDate.$lte = new Date(toDate);
  }

  // YEAR/MONTH FILTER
  if (year && month) {
    const start = new Date(year, month - 1, 1);
    const end = new Date(year, month, 0, 23, 59, 59);

    filter.startDate = { $gte: start, $lte: end };
  } else if (year) {
    const start = new Date(year, 0, 1);
    const end = new Date(year, 11, 31, 23, 59, 59);

    filter.startDate = { $gte: start, $lte: end };
  }

  const leaves = await leaveModel.find(filter).sort({ startDate: -1 });

  return {
    status: 200,
    success: true,
    message: "My leaves fetched successfully",
    totalLeaves: leaves.length,
    data: leaves,
  };
};

const getSingleLeaveService = async (user, leaveId) => {
  if (!mongoose.Types.ObjectId.isValid(leaveId)) {
    return {
      status: 400,
      success: false,
      message: "Invalid leave ID",
    };
  }

  const leave = await leaveModel.findOne({
    _id: leaveId,
    empId: user._id,
  });

  if (!leave) {
    return {
      status: 404,
      success: false,
      message: "Leave not found",
    };
  }
  return {
    status: 200,
    success: true,
    message: "Leave fetched successfully",
    data: leave,
  };
};

const cancelLeaveService = async (user, leaveId) => {
  if (!mongoose.Types.ObjectId.isValid(leaveId)) {
    return {
      status: 400,
      success: false,
      message: "Invalid leave ID",
    };
  }

  const leave = await leaveModel.findOne({
    _id: leaveId,
    empId: user._id,
  });

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
      message: "Only PENDING leave can be cancelled",
    };
  }

  await leaveModel.findByIdAndDelete(leaveId);

  return {
    status: 200,
    success: true,
    message: "Leave cancelled successfully",
  };
};

module.exports = {
  applyLeaveService,
  getMyLeavesService,
  getSingleLeaveService,
  cancelLeaveService,
  cancelLeaveService,
};
