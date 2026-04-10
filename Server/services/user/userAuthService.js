const userModel = require("../../models/userModel");
const sendEmail = require("../../utils/sendEmail");
const attendanceModel = require("../../models/attendanceModel");
const leaveModel = require("../../models/leavesModel");
const deptCalendar = require("../../models/deptCalendarModel");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const deptCalendarModel = require("../../models/deptCalendarModel");
const { status } = require("init");

const loginService = async (body) => {
  const { email, password } = body;

  if (!email || !password) {
    return {
      success: false,
      status: 400,
      message: "Email & Password are required!",
    };
  }

  const user = await userModel.findOne({ email });

  if (!user) {
    return {
      success: false,
      status: 404,
      message: "Employee not found",
    };
  }

  if (!user.activeStatus) {
    return {
      success: false,
      status: 403,
      message: "Your account is deactivated, Contact Admin",
    };
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    return {
      success: false,
      status: 401,
      message: "Invalid credentials",
    };
  }

  const token = jwt.sign(
    {
      _id: user._id,
      deptId: user.dept,
    },
    process.env.USER_SECRET_KEY,
    { expiresIn: "1d" },
  );

  return {
    success: true,
    status: 200,
    message: "Login successfull",
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
    },
  };
};

const changePasswordService = async (user, body) => {
  const { oldPassword, newPassword } = body;

  if (!oldPassword || !newPassword) {
    return {
      success: false,
      status: 400,
      message: "Old password and new password are required!",
    };
  }

  const existUser = await userModel.findById(user._id);
  if (!existUser) {
    return {
      success: false,
      status: 404,
      message: "User not found",
    };
  }

  const isMatch = await bcrypt.compare(oldPassword, existUser.password);
  if (!isMatch) {
    return {
      success: false,
      status: 401,
      message: "Old password is incorrect",
    };
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  existUser.password = hashedPassword;
  existUser.isFirstLogin = false;
  await existUser.save();

  return {
    success: true,
    status: 200,
    message: "Password changed successfully",
  };
};

const getProfileService = async (user) => {
  const profile = await userModel
    .findById(user._id)
    .select("-password -resetPasswordToken -resetPasswordExpire")
    .populate("dept", "name")
    .populate("designation", "name");

  if (!profile) {
    return {
      status: 404,
      success: false,
      message: "User not found",
    };
  }

  return {
    status: 200,
    success: true,
    message: "Profile fetched successfully",
    profile,
  };
};

const forgotPasswordService = async (email) => {
  const user = await userModel.findOne({ email });
  if (!user) {
    return { status: 404, success: false, message: "User not found" };
  }

  const resetToken = crypto.randomBytes(32).toString("hex");

  user.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  user.resetPasswordExpire = Date.now() + 15 * 60 * 1000;
  await user.save();

  const resetLink = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

  await sendEmail({
    to: user.email,
    subject: "Reset Your Password",
    html: `
      <p>Hello ${user.name},</p>
      <p>Click below to reset your password:</p>
      <a href="${resetLink}">Reset Password</a>
      <p>This link expires in 15 minutes.</p>
    `,
  });

  return {
    status: 200,
    success: true,
    message: "Reset password link sent to email",
  };
};

const resetPasswordService = async (token, newPassword) => {
  if (!newPassword) {
    return {
      status: 400,
      success: false,
      message: "New password is required",
    };
  }

  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  const user = await userModel.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return {
      status: 400,
      success: false,
      message: "Invalid or expired token",
    };
  }

  user.password = await bcrypt.hash(newPassword, 10);
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  user.isFirstLogin = false;

  await user.save();

  return {
    status: 200,
    success: true,
    message: "Password reset successful",
  };
};

const getEmpCalendarService = async (user, query) => {
  try {
    const {
      month,
      year,
      holidays = "true",
      leaves = "true",
      attendance = "true",
    } = query;

    if (!month || !year) {
      return {
        status: 400,
        success: false,
        message: "Month and year are required",
      };
    }

    const monthNum = Number(month);
    const yearNum = Number(year);

    if (
      Number.isNaN(monthNum) ||
      Number.isNaN(yearNum) ||
      monthNum < 1 ||
      monthNum > 12 ||
      yearNum < 2000 ||
      yearNum > 2100
    ) {
      return {
        status: 400,
        success: false,
        message: "Invalid month or year",
      };
    }

    const start = new Date(Date.UTC(yearNum, monthNum - 1, 1));
    const end = new Date(Date.UTC(yearNum, monthNum, 0, 23, 59, 59));

    const daysInMonth = new Date(yearNum, monthNum, 0).getDate();
    const calendarMap = {};

    for (let d = 1; d <= daysInMonth; d++) {
      const date = new Date(Date.UTC(yearNum, monthNum - 1, d));
      const key = date.toISOString().split("T")[0];

      calendarMap[key] = {
        date,
        attendanceStatus: null,
        leaveStatus: null,
        holiday: null,
        weeklyOff: false,
        workingDayOverride: null,
        checkInTime: null,
        checkOutTime: null,
        workingHours: null,
      };
    }

    const deptCalendar = await deptCalendarModel.findOne({
      deptId: user.dept,
      year: yearNum,
    });

    if (!deptCalendar) {
      return {
        status: 404,
        success: false,
        message: "Calendar not found",
      };
    }

    if (deptCalendar) {
      Object.values(calendarMap).forEach((day) => {
        const dayName = day.date
          .toLocaleDateString("en-US", { weekday: "long" })
          .toUpperCase();

        if (deptCalendar.weeklyOff.includes(dayName)) {
          day.weeklyOff = true;
        }
      });
    }

    const MONTH_NAMES = [
      "JANUARY",
      "FEBRUARY",
      "MARCH",
      "APRIL",
      "MAY",
      "JUNE",
      "JULY",
      "AUGUST",
      "SEPTEMBER",
      "OCTOBER",
      "NOVEMBER",
      "DECEMBER",
    ];

    const monthData = deptCalendar.months.find(
      (m) => m.month === MONTH_NAMES[monthNum - 1],
    );

    if (monthData) {
      // Holidays
      monthData.holidays.forEach((h) => {
        const key = new Date(h.date).toISOString().split("T")[0];
        if (calendarMap[key]) {
          calendarMap[key].holiday = h.title;
        }
      });

      // Working Day Overrides (override weekly off)
      monthData.workingDaysOverride.forEach((w) => {
        const key = new Date(w.date).toISOString().split("T")[0];
        if (calendarMap[key]) {
          calendarMap[key].workingDayOverride = w.reason;
          calendarMap[key].weeklyOff = false;
        }
      });
    }

    if (attendance === "true") {
      const records = await attendanceModel.find({
        empId: user._id,
        date: { $gte: start, $lte: end },
      });

      records.forEach((r) => {
        const key = r.date.toISOString().split("T")[0];
        if (calendarMap[key]) {
          calendarMap[key].attendanceStatus = r.attendanceStatus;
          calendarMap[key].checkInTime = r.checkInTime;
          calendarMap[key].checkOutTime = r.checkOutTime;
          calendarMap[key].workingHours = r.workingHours;
        }
      });
    }

    if (leaves === "true") {
      const leaveRecords = await leaveModel.find({
        empId: user._id,
        leaveStatus: "APPROVED",
        leaveDates: { $gte: start, $lte: end },
      });

      leaveRecords.forEach((leave) => {
        leave.leaveDates.forEach((d) => {
          const key = d.toISOString().split("T")[0];

          // Leave applies ONLY if no attendance exists
          if (calendarMap[key] && !calendarMap[key].attendanceStatus) {
            calendarMap[key].leaveStatus = "APPROVED";
          }
        });
      });
    }



    return {
      status: 200,
      success: true,
      message: "Calendar fetched successfully",
      data: Object.values(calendarMap),
    };
  } catch (error) {
    console.error("EMP CALENDAR SERVICE ERROR:", error);
    return {
      status: 500,
      success: false,
      message: "Internal server error",
    };
  }
};

module.exports = {
  loginService,
  changePasswordService,
  getProfileService,
  forgotPasswordService,
  resetPasswordService,
  getEmpCalendarService,
};
