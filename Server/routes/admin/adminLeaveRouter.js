const express = require("express");
const router = express.Router();
const adminProtect = require("../../middlewares/adminAuthMiddleware");
const {
  getAllLeavesController,
  approveLeaveController,
  rejectLeaveController,
  deleteLeaveController,
  getLeavesByEmpController,
  getLeaveSummaryController,
} = require("../../controllers/admin/adminLeaveController");

router.get("/", adminProtect, getAllLeavesController);
router.get("/emp/:empId", adminProtect, getLeavesByEmpController);
router.get("/summary", adminProtect, getLeaveSummaryController);

router.patch("/approve/:leaveId", adminProtect, approveLeaveController);
router.patch("/reject/:leaveId", adminProtect, rejectLeaveController);

router.delete("/delete/:leaveId", adminProtect, deleteLeaveController);

module.exports = router;
