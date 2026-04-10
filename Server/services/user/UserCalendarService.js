const calendarModel = require("../../models/deptCalendarModel");

// GET FULL CALENDAR
const getUserCalendarService = async (req) => {
  try {
    const user = req.user;
    const { year } = req.query;

    if (!user || !user.dept) {
      return {
        status: 400,
        success: false,
        message: "User department not found",
      };
    }

    const calendar = await calendarModel.findOne({
      deptId: user.dept,
      year,
    });

    if (!calendar) {
      return {
        status: 404,
        success: false,
        message: "Calendar not found",
      };
    }

    return {
      status: 200,
      success: true,
      calendar,
    };
  } catch (error) {
    console.log("GET USER CALENDAR ERROR:", error);
    return {
      status: 500,
      success: false,
      message: "Internal server error",
    };
  }
};

// GET MONTH DATA
const getUserMonthCalendarService = async (req) => {
  try {
    const user = req.user;
    const { year, month } = req.query;

    if (!user || !user.dept) {
      return {
        status: 400,
        success: false,
        message: "User department not found",
      };
    }

    const calendar = await calendarModel.findOne({
      deptId: user.dept,
      year,
    });

    if (!calendar) {
      return {
        status: 404,
        success: false,
        message: "Calendar not found",
      };
    }

    const monthData = calendar.months.find(
      (m) => m.month === month
    );

    if (!monthData) {
      return {
        status: 404,
        success: false,
        message: "Month not found",
      };
    }

    return {
      status: 200,
      success: true,
      month: monthData,
    };
  } catch (error) {
    console.log("GET USER MONTH ERROR:", error);
    return {
      status: 500,
      success: false,
      message: "Internal server error",
    };
  }
};

module.exports = {
  getUserCalendarService,
  getUserMonthCalendarService,
};