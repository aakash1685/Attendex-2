const {
  getUserCalendarService,
  getUserMonthCalendarService,
} = require("../../services/user/UserCalendarService");

// GET FULL CALENDAR
const getUserCalendarController = async (req, res) => {
  try {
    const result = await getUserCalendarService(req);
    return res.status(result.status).json(result);
  } catch (error) {
    console.log("USER CALENDAR ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// GET MONTH DATA
const getUserMonthCalendarController = async (req, res) => {
  try {
    const result = await getUserMonthCalendarService(req);
    return res.status(result.status).json(result);
  } catch (error) {
    console.log("USER MONTH CALENDAR ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

module.exports = {
  getUserCalendarController,
  getUserMonthCalendarController,
};