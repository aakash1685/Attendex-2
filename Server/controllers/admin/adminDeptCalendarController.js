const {
  createDeptCalendarService,
  updateDeptCalendarService,
  getCalendarByYearService,
  getAllYearsCalendarService,
  getMonthCalendarService,
  checkDayService,
  getHolidaysService,
  deleteCalendarService,
  updateSingleMonthService,
} = require("../../services/admin/adminDeptCalendarService");

//CREATE CALENDAR
const createDeptCalendarController = async (req, res) => {
  try {
    const result = await createDeptCalendarService(req.body, req.admin);
    return res.status(result.status).json(result);
  } catch (error) {
    console.log("ERROR IN CREATE CALENDER", error);
    return res.status(500).json({
      succes: false,
      message: "Internal server error",
    });
  }
};

//UPDATE CALENDAR
const updateDeptCalendarController = async (req, res) => {
  try {
    const { deptId, year } = req.params;
    const result = await updateDeptCalendarService(
      deptId,
      year,
      req.body,
      req.admin,
    );
    return res.status(result.status).json(result);
  } catch (error) {
    console.log("ERROR IN UPDATE CALENDAR CONTROLLER", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

//GET CALENDAR BY YEAR
const getCalendarByYearController = async (req, res) => {
  try {
    const { deptId, year } = req.params;
    const result = await getCalendarByYearService(deptId, year, req.admin);
    return res.status(result.status).json(result);
  } catch (error) {
    console.log("ERROR: ", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

//GET ALL YEARS CALENDAR BY DEPARTMENT
const getAllYearsCalendarController = async (req, res) => {
  try {
    const { deptId } = req.params;
    const result = await getAllYearsCalendarService(deptId, req.admin);
    return res.status(result.status).json(result);
  } catch (error) {
    console.log("ERROR: ", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

//GET SPECIFIC MONTH
const getMonthCalendarController = async (req, res) => {
  try {
    const { deptId, year, month } = req.params;
    const data = {
      deptId,
      year,
      month,
    };
    const result = await getMonthCalendarService(data, req.admin);
    return res.status(result.status).json(result);
  } catch (error) {
    console.log("ERROR: ", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

//CHECK DAY
const checkDayController = async (req, res) => {
  try {
    const { deptId, date } = req.params;
    const data = {
      deptId,
      date,
    };
    const result = await checkDayService(data, req.admin);
    return res.status(result.status).json(result);
  } catch (error) {
    console.log("ERROR: ", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

//GET HOLIDAYS
const getHolidaysController = async (req, res) => {
  try {
    const { deptId, year } = req.params;
    const data = {
      deptId,
      year,
    };
    const result = await getHolidaysService(data, req.admin);
    return res.status(result.status).json(result);
  } catch (error) {
    console.log("ERROR: ", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

//DELETE CALENDAR
const deleteCalendarController = async (req, res) => {
  try {
    const { deptId, year } = req.params;

    const result = await deleteCalendarService(deptId, year, req.admin);
    return res.status(result.status).json(result);
  } catch (error) {
    console.log("ERROR: ", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

//UPDATE SINGLE MONTH
const updateSingleMonthController = async (req, res) => {
  try {
    const data = {
      deptId: req.params.deptId,
      year: req.params.year,
      month: req.params.month,
    };

    const result = await updateSingleMonthService(data, req.body, req.admin);
    return res.status(result.status).json(result);
  } catch (error) {
    console.log("ERROR: ", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

module.exports = {
  createDeptCalendarController,
  updateDeptCalendarController,
  getCalendarByYearController,
  getAllYearsCalendarController,
  getMonthCalendarController,
  checkDayController,
  getHolidaysController,
  deleteCalendarController,
  updateSingleMonthController,
};
