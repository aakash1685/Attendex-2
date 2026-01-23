const express = require("express");
const router = express.Router();
const adminProtect = require("../../middlewares/adminAuthMiddleware");
const {
  getAllDeptController,
  getDeptByIdController,
  createDeptController,
  updateDeptController,
  deactiveDeptController,
  activateDeptController,
} = require("../../controllers/admin/adminDeptController");

router.post("/create", adminProtect, createDeptController);
router.get("/", adminProtect, getAllDeptController);
router.get("/:deptId", adminProtect, getDeptByIdController);
router.put("/edit/:deptId", adminProtect, updateDeptController);
router.patch("/deactive/:deptId", adminProtect, deactiveDeptController);
router.patch("/activate/:deptId", adminProtect, activateDeptController);

module.exports = router;
