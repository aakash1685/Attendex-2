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

const getAllAttendanceByEmpService = async (query, empId, admin) => {
  const check = adminCheck(admin);
  if (check) return check;

  const { fromDate, toDate, status } = query;

  const filter = {
    empId: new mongoose.Types.ObjectId(empId),
  };

  if (status) filter.attendanceStatus = status.toUpperCase();

  if (fromDate || toDate) {
    filter.date = {};
    if (fromDate) filter.date.$gte = new Date(fromDate);
    if (toDate) filter.date.$lte = new Date(toDate);
  }

  const attendance = await attendanceModel
    .find(filter)
    .populate("empId", "name email mobileNo")
    .populate("deptId", "deptName")
    .sort({ date: -1 });

  if (!attendance.length) {
    return {
      status: 404,
      success: false,
      message: "No attendance found for this employee",
      totalRecords: 0,
      attendance: [],
    };
  }
  return {
    status: 200,
    success: true,
    message: "Attendance fetched successfully",
    totalRecords: attendance.length,
    attendance,
  };
};

const getAllAttendanceByDeptService = async (deptId, query, admin) => {
  const check = adminCheck(admin);
  if (check) return check;

  const { fromDate, toDate, status } = query;

  const filter = {
    deptId: new mongoose.Types.ObjectId(deptId),
  };

  if (status) {
    filter.attendanceStatus = status.toUpperCase();
  }

  if (fromDate || toDate) {
    filter.date = {};
    if (fromDate) filter.date.$gte = new Date(fromDate);
    if (toDate) filter.date.$lte = new Date(toDate);
  }

  const attendance = await attendanceModel
    .find(filter)
    .populate("empId", "name email")
    .populate("deptId", "name")
    .sort({ date: -1 });

  if (!attendance.length) {
    return {
      status: 404,
      success: false,
      message: "No attendance found for this department",
      totalRecords: 0,
      attendance: [],
    };
  }

  return {
    status: 200,
    success: true,
    message: "Department attendance fetched successfully",
    totalRecords: attendance.length,
    attendance,
  };
};

const getAttendanceSummaryService = async (query, admin) => {
  const check = adminCheck(admin);
  if (check) return check;

  const { year, month, deptId } = query;
  const match = {};

  if (deptId) {
    match.deptId = new mongoose.Types.ObjectId(deptId);
  }

  //FILTER BY YEAR/MONTH
  if (year) {
    const start = new Date(year, month ? month - 1 : 0, 1);
    const end = month
      ? new Date(year, month, 0, 23, 59, 59)
      : new Date(year, 11, 31, 23, 59, 59);

    match.date = { $gte: start, $lte: end };
  }

  const summary = await attendanceModel.aggregate([
    { $match: match },
    {
      $group: {
        _id: "$attendanceStatus",
        count: { $sum: 1 },
      },
    },
  ]);

  const result = {
    total: 0,
    PRESENT: 0,
    ABSENT: 0,
    HALF_DAY: 0,
    LEAVE: 0,
  };

  summary.forEach((s) => {
    result[s._id] = s.count;
    result.total += s.count;
  });

  return {
    status: 200,
    success: true,
    message: "Attendance summary fetched successfully",
    data: result,
  };
};

const updateAttendanceService = async (attendanceId, body, admin) => {
  const check = adminCheck(admin);
  if (check) return check;

  const { checkInTime, checkOutTime, attendanceStatus } = body;

  const attendance = await attendanceModel.findById(attendanceId);

  if (!attendance) {
    return {
      status: 404,
      success: false,
      message: "Attendance record not found",
    };
  }

  if (checkInTime) attendance.checkInTime = new Date(checkInTime);
  if (checkOutTime) attendance.checkOutTime = new Date(checkOutTime);

  if (attendanceStatus) {
    attendance.attendanceStatus = attendanceStatus.toUpperCase();
  }

  await attendance.save();

  return {
    status: 200,
    success: true,
    message: "Attendance updated successfully",
    data: attendance,
  };
};

const mannualAttendanceService = async (body, admin) => {
  const check = adminCheck(admin);
  if (check) return check;

  const { empId,deptId, date, checkInTime, checkOutTime, attendanceStatus } = body;

  const attendanceDate = new Date(date);
  attendanceDate.setHours(0, 0, 0, 0);

  const exists = await attendanceModel.findOne({
    empId,
    date: attendanceDate,
  });

  if (exists) {
    return {
      status: 400,
      success: false,
      message: "Attendance already exists for this date",
    };
  }

  const attendance = new attendanceModel({
    empId,
    deptId,
    date: attendanceDate,
    checkInTime: checkInTime ? new Date(checkInTime) : null,
    checkOutTime: checkOutTime ? new Date(checkOutTime) : null,
    attendanceStatus: attendanceStatus
      ? attendanceStatus.toUpperCase()
      : "PRESENT",
  });
  await attendance.save();

  return {
    status: 201,
    success: true,
    message: "Manual attendance created successfully",
    data: attendance,
  };
};
module.exports = {
  getAllAttendanceService,
  getAllAttendanceByEmpService,
  getAllAttendanceByDeptService,
  getAttendanceSummaryService,
  updateAttendanceService,
  mannualAttendanceService,
};
