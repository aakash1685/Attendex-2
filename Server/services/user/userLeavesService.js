const leaveModel = require("../../models/leavesModel");
const leaveBalanceModel = require("../../models/leavesBalanceModel");
const deptCalendarModel = require("../../models/deptCalendarModel");
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

  // ✅ Normalize, deduplicate & sort
  const normalizedDates = [...new Set(leaveDates)]
    .map((d) => {
      const date = new Date(d);
      date.setUTCHours(0, 0, 0, 0);
      return date;
    })
    .sort((a, b) => a - b);

  const requestedYears = [...new Set(normalizedDates.map((d) => d.getUTCFullYear()))];
  const deptCalendars = await deptCalendarModel.find({
    deptId: user.dept,
    year: { $in: requestedYears },
  });
  const calendarByYear = new Map(deptCalendars.map((calendar) => [calendar.year, calendar]));

  const skippedWeeklyOffDates = [];
  const skippedHolidayDates = [];
  const eligibleDates = [];

  normalizedDates.forEach((dateObj) => {
    const key = dateObj.toISOString().split("T")[0];
    const year = dateObj.getUTCFullYear();
    const calendar = calendarByYear.get(year);

    if (!calendar) {
      eligibleDates.push(dateObj);
      return;
    }

    const dayName = dateObj.toLocaleDateString("en-US", { weekday: "long", timeZone: "UTC" }).toUpperCase();
    const monthName = dateObj.toLocaleDateString("en-US", { month: "long", timeZone: "UTC" }).toUpperCase();
    const monthData = calendar.months.find((m) => m.month === monthName);

    const isHoliday = monthData?.holidays?.some((holiday) => new Date(holiday.date).toISOString().split("T")[0] === key);
    const isOverrideWorkingDay = monthData?.workingDaysOverride?.some(
      (override) => new Date(override.date).toISOString().split("T")[0] === key,
    );
    const isWeeklyOff = calendar.weeklyOff.includes(dayName) && !isOverrideWorkingDay;

    if (isHoliday) {
      skippedHolidayDates.push(key);
      return;
    }

    if (isWeeklyOff) {
      skippedWeeklyOffDates.push(key);
      return;
    }

    eligibleDates.push(dateObj);
  });

  const existingLeaves = await leaveModel.find({
    empId: user._id,
    leaveDates: { $in: eligibleDates },
    leaveStatus: { $ne: "REJECTED" },
  });

  const existingLeaveDateSet = new Set(
    existingLeaves.flatMap((leave) => leave.leaveDates.map((d) => d.toISOString().split("T")[0])),
  );
  const skippedExistingDates = [];

  const finalDates = eligibleDates.filter((dateObj) => {
    const key = dateObj.toISOString().split("T")[0];
    if (existingLeaveDateSet.has(key)) {
      skippedExistingDates.push(key);
      return false;
    }
    return true;
  });

  if (finalDates.length === 0) {
    return {
      status: 400,
      success: false,
      message:
        "No applicable leave dates found after excluding holidays, weekly offs, and existing leave dates.",
      skipped: {
        holidays: skippedHolidayDates,
        weeklyOffs: skippedWeeklyOffDates,
        existingLeaves: skippedExistingDates,
      },
    };
  }

  const startDate = finalDates[0];
  const endDate = finalDates[finalDates.length - 1];
  const totalDays = finalDates.length;

  // ✅ Check Leave Balance (except LOP)
  if (leaveType !== "LOP") {
    let balance = await leaveBalanceModel.findOne({ empId: user._id });

    if (!balance) {
      balance = await leaveBalanceModel.create({
        empId: user._id,
        CL: { total: 6, used: 0, remaining: 6 },
        SL: { total: 6, used: 0, remaining: 6 },
        PL: { total: 12, used: 0, remaining: 12 },
      });
    }

    const remaining = Number(balance?.[leaveType]?.remaining || 0);

    if (remaining <= 0) {
      return {
        status: 400,
        success: false,
        message: `No ${leaveType} balance remaining. Please choose another leave type.`,
      };
    }

    if (remaining < totalDays) {
      return {
        status: 400,
        success: false,
        message: `Not enough ${leaveType} balance. Remaining: ${remaining}, requested: ${totalDays}.`,
      };
    }
  }

  // ✅ Create Leave
  const leave = await leaveModel.create({
    empId: user._id,
    deptId: user.dept,
    leaveType: leaveType,
    reason,
    leaveDates: finalDates,
    startDate,
    endDate,
    totalDays,
    leaveStatus: "PENDING",
  });

  return {
    status: 201,
    success: true,
    message:
      skippedHolidayDates.length || skippedWeeklyOffDates.length || skippedExistingDates.length
        ? "Leave applied for applicable dates only. Holidays/weekly offs/existing leave dates were skipped."
        : "Leave applied successfully",
    data: leave,
    skipped: {
      holidays: skippedHolidayDates,
      weeklyOffs: skippedWeeklyOffDates,
      existingLeaves: skippedExistingDates,
    },
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
