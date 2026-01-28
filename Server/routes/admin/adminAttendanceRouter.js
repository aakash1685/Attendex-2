const express = require("express");
const router = express.Router();
const adminProtect = require("../../middlewares/adminAuthMiddleware");
const {
  getAllAttendanceController,
  getAllAttendanceByEmpController,
  getAllAttendanceByDeptController,
  getAttendanceSummaryController,
  updateAttendanceController,
  mannualAttendanceController,
} = require("../../controllers/admin/adminAttendanceController");

router.get("/", adminProtect, getAllAttendanceController);
router.get("/emp/:empId", adminProtect, getAllAttendanceByEmpController);
router.get("/dept/:deptId", adminProtect, getAllAttendanceByDeptController);
router.get("/summary", adminProtect, getAttendanceSummaryController);
router.patch("/edit/:attendanceId", adminProtect, updateAttendanceController);
router.post("/mannual", adminProtect, mannualAttendanceController);


module.exports = router;
