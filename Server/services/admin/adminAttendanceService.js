const attendanceModel = require("../../models/attendanceModel");
const mongoose = require("mongoose");
const adminCheck = require("../../utils/adminCheck");
const isValidDate = require("../../utils/isValidDate");

const getAllAttendanceService = async (query, admin) => {
  const check = adminCheck(admin);
  if (check) return check;

  const { empId, deptId, date, fromDate, toDate, attendanceStatus } = query;

  const filter = {};
  if (empId) filter.empId = new mongoose.Types.ObjectId(empId);
  if (deptId) filter.deptId = new mongoose.Types.ObjectId(deptId);
  if (attendanceStatus)
    filter.attendanceStatus = attendanceStatus.toUpperCase();

  // SINGLE DATE
  if (date) {
    if (!isValidDate(date)) {
      return {
        status: 400,
        success: false,
        message: "Invalid date format",
      };
    }

    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    filter.date = d;
  }

  // FROM & TO DATE
  if (fromDate || toDate) {
    filter.date = {};

    if (fromDate) {
      if (!isValidDate(fromDate)) {
        return {
          status: 400,
          success: false,
          message: "Invalid fromDate format",
        };
      }
      filter.date.$gte = new Date(fromDate);
    }

    if (toDate) {
      if (!isValidDate(toDate)) {
        return {
          status: 400,
          success: false,
          message: "Invalid toDate format",
        };
      }
      filter.date.$lte = new Date(toDate);
    }
  }
  const attendance = await attendanceModel
    .find(filter)
    .populate("empId", "name email")
    .populate("deptId", "deptName")
    .sort({ date: -1 });

  if (!attendance.length) {
    return {
      status: 404,
      success: false,
      message: "No attendance records found",
      total: 0,
      data: [],
    };
  }

  return {
    status: 200,
    success: true,
    message: "Attendance fetched successfully",
    total: attendance.length,
    data: attendance,
  };
};

module.exports = {
  getAllAttendanceService,
};
