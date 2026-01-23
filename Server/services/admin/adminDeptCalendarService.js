const deptCalendarModel = require("../../models/deptCalendarModel");
const mongoose = require("mongoose");
const adminCheck = require("../../utils/adminCheck");

//CREATE CALENDAR
const createDeptCalendarService = async (data, admin) => {
  const check = adminCheck(admin);
  if (check) return check;

  const { deptId, year, weeklyOff, months } = data;
  if (!deptId || !year || !weeklyOff || !months) {
    return {
      status: 400,
      success: false,
      message: "All fields are required!",
    };
  }

  try {
    const calendar = await deptCalendarModel.create({
      deptId,
      year,
      weeklyOff,
      months,
    });

    return {
      status: 201,
      success: true,
      message: "Department calendar created successfully!",
      data: calendar,
    };
  } catch (error) {
    if (error.code === 11000) {
      return {
        status: 409,
        success: false,
        message: "Calendar already exists for this department and year",
      };
    }
    throw error;
  }
};

//UPDATE CALENDAR
const updateDeptCalendarService = async (deptId, year, data, admin) => {
  const check = adminCheck(admin);
  if (check) return check;

  const { weeklyOff, months } = data;
  if (!weeklyOff || !months) {
    return {
      status: 400,
      success: false,
      message: "weeklyOff and months are required",
    };
  }

  if (!Array.isArray(months) || months.length !== 12) {
    return {
      status: 400,
      success: false,
      message: "Exactly 12 months must be provided",
    };
  }
  const calendar = await deptCalendarModel.findOne({
    dept: deptId,
    year: Number(year),
  });
  if (!calendar) {
    return {
      status: 404,
      success: false,
      message: "calendar not found!",
    };
  }
  //Update Data
  ((calendar.weeklyOff = weeklyOff),
    (calendar.months = months),
    await calendar.save());

  return {
    success: true,
    status: 200,
    message: "Calendar updated successfully",
    calendar,
  };
};

//GET CALENDAR BY YEAR
const getCalendarByYearService = async (deptId, year, admin) => {
  const check = adminCheck(admin);
  if (check) return check;

  const parsedYear = parseInt(year);
  if (isNaN(parsedYear)) {
    return {
      success: false,
      status: 404,
      message: "Invalid year parameter",
    };
  }

  const calendar = await deptCalendarModel.findOne({
    deptId,
    year: parsedYear,
  });
  if (!calendar) {
    return {
      success: false,
      status: 200,
      message: "Calendar not found for this year",
    };
  }

  return {
    success: true,
    status: 201,
    message: "Calendar fetched successfully!",
    calendar,
  };
};

//GET ALL YEARS CALENDAR BY DEPARTMENT
const getAllYearsCalendarService = async (deptId, admin) => {
  const check = adminCheck(admin);
  if (check) return check;

  const calendars = await deptCalendarModel.find({
    deptId,
  });

  if (!calendars) {
    return {
      success: false,
      status: 200,
      message: "Calendars not found for this department",
    };
  }
  return {
    success: true,
    status: 201,
    message: "Calendars fetched successfully!",
    calendars,
  };
};

//GET SPECIFIC MONTH
const getMonthCalendarService = async (data, admin) => {
  const check = adminCheck(admin);
  if (check) return check;

  const parsedYear = parseInt(data.year);
  if (isNaN(parsedYear)) {
    return {
      success: false,
      status: 400,
      message: "Invalid year parameter",
    };
  }

  const calendar = await deptCalendarModel.findOne({
    deptId: data.deptId,
    year: parsedYear,
  });

  if (!calendar) {
    return {
      success: false,
      status: 404,
      message: "Calendar not found",
    };
  }

  const monthData = calendar.months.find(
    (m) => m.month === data.month.toUpperCase(),
  );

  if (!monthData) {
    return {
      success: false,
      status: 404,
      message: "Month not found",
    };
  }

  return {
    success: true,
    status: 200,
    message: "Month calendar fetched successfully",
    monthData,
  };
};

//CHECK DAY
const checkDayService = async (data, admin) => {
  const check = adminCheck(admin);
  if (check) return check;

  const { date, deptId } = data;

  const inputDate = new Date(date);
  if (isNaN(inputDate.getTime())) {
    return {
      status: 400,
      success: false,
      message: "Invalid date format!",
    };
  }

  const year = inputDate.getFullYear();
  const dayName = inputDate
    .toLocaleDateString("en-US", { weekday: "long" })
    .toUpperCase();

  const calendar = await deptCalendarModel.findOne({
    deptId,
    year,
  });

  if (!calendar) {
    return {
      success: false,
      status: 404,
      message: "Calendar not found",
    };
  }

  //WEEKLY OFF CHECK
  if (calendar.weeklyOff.includes(dayName)) {
    return {
      succes: true,
      status: 200,
      type: "WEEKLY_OFF",
      message: `${dayName} is weekly off`,
    };
  }

  const monthName = inputDate
    .toLocaleDateString("en-US", { month: "long" })
    .toUpperCase();

  const month = calendar.months.find((m) => m.month === monthName);
  if (!month) {
    return {
      success: false,
      status: 404,
      message: "Month not found in calendar",
    };
  }

  //CHECK HOLIDAY
  const holiday = month.holidays.find(
    (h) => new Date(h.date).toDateString() === inputDate.toDateString(),
  );

  if (holiday) {
    return {
      success: true,
      status: 200,
      type: "HOLIDAY",
      message: holiday.title,
    };
  }

  return {
    success: true,
    status: 200,
    type: "WORKING_DAY",
    message: "Working day",
  };
};

//GET HOLIDAYS SERVICE
const getHolidaysService = async (data, admin) => {
  const check = adminCheck(admin);
  if (check) return check;

  const { deptId, year } = data;

  const parsedYear = parseInt(year);
  if (isNaN(parsedYear)) {
    return {
      success: false,
      status: 400,
      message: "Invalid year parameter",
    };
  }

  const calendar = await deptCalendarModel.findOne({
    deptId,
    year: parsedYear,
  });

  if (!calendar) {
    return {
      success: false,
      status: 404,
      message: "Calendar not found",
    };
  }

  const holidays = calendar.months.flatMap((m) =>
    m.holidays.map((h) => ({
      date: h.date,
      title: h.title,
      month: m.month,
    })),
  );

  return {
    success: true,
    status: 200,
    message: "Holidays fetched successfully",
    data: holidays,
  };
};

//DELETE CALENDAR
const deleteCalendarService = async (deptId, year, admin) => {
  const check = adminCheck(admin);
  if (check) return check;

  const parsedYear = parseInt(year);
  if (isNaN(parsedYear)) {
    return {
      success: false,
      status: 400,
      message: "Invalid year parameter",
    };
  }

  const deleteCalendar = await deptCalendarModel.findOneAndDelete({
    deptId,
    year: parsedYear,
  });

  if (!deleteCalendar) {
    return {
      success: false,
      status: 404,
      message: "Calendar not found for this year",
    };
  }

  return {
    success: true,
    status: 200,
    message: "Calendar deleted successfully",
  };
};

//UPDATE SINGLE MONTH
const updateSingleMonthService = async (data, monthData, admin) => {
  const check = adminCheck(admin);
  if (check) return check;

  const { deptId, month, year } = data;

  const parsedYear = parseInt(year);
  if (isNaN(parsedYear)) {
    return {
      success: false,
      status: 400,
      message: "Invalid year parameter",
    };
  }

  const calendar = await deptCalendarModel.findOne({
    deptId: new mongoose.Types.ObjectId(deptId),
    year: parsedYear,
  });

  if (!calendar) {
    return {
      success: false,
      status: 404,
      message: "Calendar not found",
    };
  }

  const monthIndex = calendar.months.findIndex(
    (m) => m.month === month.toUpperCase(),
  );

  if (monthIndex === -1) {
    return {
      success: false,
      status: 404,
      message: "Month not found",
    };
  }

  //UPDATE ONLY PROVIDED FIELDS
  if (monthData.holidays !== undefined) {
    calendar.months[monthIndex].holidays = monthData.holidays;
  }

  if (monthData.workingDaysOverride !== undefined) {
    calendar.months[monthIndex].workingDaysOverride =
      monthData.workingDaysOverride;
  }

  await calendar.save();

  return {
    success: true,
    status: 200,
    message: "Month updated successfully",
    data: calendar.months[monthIndex],
  };
};

module.exports = {
  createDeptCalendarService,
  updateDeptCalendarService,
  getCalendarByYearService,
  getAllYearsCalendarService,
  getMonthCalendarService,
  checkDayService,
  getHolidaysService,
  deleteCalendarService,
  updateSingleMonthService,
};
