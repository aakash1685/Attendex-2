const attendanceModel = require("../../models/attendanceModel");
const getDistance = require("../../utils/gpsDistance");
const { OFFICE_LOCATION } = require("../../config/officeConfig");

// Get client IP
const getClientIp = (req) =>
  req.headers["x-forwarded-for"]?.split(",")[0] || req.socket.remoteAddress;



const checkInService = async (req) => {
  try {
    //GET DATA
    const { latitude, longitude } = req.body;
    const empId = req.user._id;
    const deptId = req.user.dept;

    if (!deptId) {
  return {
    status: 400,
    success: false,
    message: "Department not assigned to user",
  };
}

    if (!latitude || !longitude) {
      return {
        success: false,
        status: 400,
        message: "Latitude and Longitude are required",
      };
    }

    // WIFI CHECK
    const clientIp = getClientIp(req);

    const allowed =
      clientIp === "::1" ||
      clientIp === "127.0.0.1" ||
      clientIp.startsWith("192.168.1.");

    if (!allowed) {
      return {
        status: 403,
        success: false,
        message: "Please connect to office Wi-Fi to check in",
      };
    }

    //GPS DISTANCE CHECK
    const distance = getDistance(
      OFFICE_LOCATION.lat,
      OFFICE_LOCATION.lng,
      latitude,
      longitude,
    );

    if (distance > OFFICE_LOCATION.radius) {
      return {
        success: false,
        status: 403,
        message: "You are outside of office premises",
      };
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // FIND TODAYS ATTENDNCE
    let attendance = await attendanceModel.findOne({
      empId,
      date: today,
    });
    if (!attendance) {
      attendance = new attendanceModel({
        empId,
        deptId,
        date: today,
      });
    }
    if (attendance.checkInTime) {
      return {
        status: 400,
        success: false,
        message: "Already checked in today",
      };
    }

    //SAVE CHECK-IN
    attendance.checkInTime = new Date();
    attendance.attendanceStatus = "PRESENT";

    await attendance.save();

    return {
      status: 200,
      success: true,
      message: "Checkin successful",
      checkInTime: attendance.checkInTime,
      attendance,
    };
  } catch (error) {
    console.error("CHECK-IN SERVICE ERROR:", error);
    return {
      status: 500,
      success: false,
      message: "Internal server error",
    };
  }
};

const checkOutService = async (req) => {
  try {
    const empId = req.user._id;
    const { latitude, longitude } = req.body;

    if (!latitude || !longitude) {
      return {
        status: 400,
        success: false,
        message: "Latitude and Longitude are required",
      };
    }

    const clientIp =
      req.headers["x-forwarded-for"]?.split(",")[0] || req.socket.remoteAddress;

    const allowed =
      clientIp === "::1" ||
      clientIp === "127.0.0.1" ||
      clientIp.startsWith("192.168.1.");

    if (!allowed) {
      return {
        status: 403,
        success: false,
        message: "Please connect to office Wi-Fi to check out",
      };
    }

    const distance = getDistance(
      OFFICE_LOCATION.lat,
      OFFICE_LOCATION.lng,
      latitude,
      longitude,
    );

    if (distance > OFFICE_LOCATION.radius) {
      return {
        status: 403,
        success: false,
        message: "You are outside office premises",
      };
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const attendance = await attendanceModel.findOne({
      empId,
      date: today,
    });

    if (!attendance) {
      return {
        status: 404,
        success: false,
        message: "No check-in record found for today",
      };
    }

    if (!attendance.checkInTime) {
      return {
        status: 400,
        success: false,
        message: "Check-in required before cehck-out",
      };
    }

    attendance.checkOutTime = new Date();

    const workingMs = attendance.checkOutTime - attendance.checkInTime;
    attendance.workingHours = Number((workingMs / (1000 * 60 * 60)).toFixed(2)); //CONVERTING MILI SECOND INTO HOURS

    await attendance.save();

    return {
      status: 200,
      success: true,
      message: "Check-out successful",
      attendance,
      Attendance: {
        checkIn: attendance.checkInTime,
        checkOut: attendance.checkOutTime,
        workingHours: attendance.workingHours,
      },
    };
  } catch (error) {
    console.log("ERROR CHECK-OUT SERVICE", error);
    return {
      status: 500,
      success: false,
      message: "Internal server error",
    };
  }
};

module.exports = {
  checkInService,
  checkOutService,
};
