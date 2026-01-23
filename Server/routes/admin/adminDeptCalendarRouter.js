const express = require("express");
const router = express.Router();
const adminProtect = require("../../middlewares/adminAuthMiddleware");
const {
  createDeptCalendarController,
  updateDeptCalendarController,
  getCalendarByYearController,
  getAllYearsCalendarController,
  getMonthCalendarController,
  checkDayController,
  getHolidaysController,
  deleteCalendarController,
  updateSingleMonthController
} = require("../../controllers/admin/adminDeptCalendarController");

router.post("/create", adminProtect, createDeptCalendarController); //CREATE CALENDAR

router.put("/update/:id/:year/", adminProtect, updateDeptCalendarController); //UPDATE CALENDAR
router.patch("/month/:deptId/:year/:month", adminProtect, updateSingleMonthController) //UPDATE SINGLE MONTH CALENDAR

router.get("/year/:deptId/:year", adminProtect, getCalendarByYearController); //GET CALENDAR BY YEAR
router.get("/years/:deptId", adminProtect, getAllYearsCalendarController); //GET ALL YEARS CALENDAR BY DEPARTMENT
router.get("/month/:deptId/:year/:month", adminProtect, getMonthCalendarController); //GET SPECIFIC MONTH
router.get("/check-day/:deptId/:date", adminProtect, checkDayController); //CHECK DAY 
router.get("/holidays/:deptId/:year", adminProtect, getHolidaysController); //GET HOLIDAYS

router.delete("/year/:deptId/:year", adminProtect, deleteCalendarController); //DELETE CALENDAR

module.exports = router;