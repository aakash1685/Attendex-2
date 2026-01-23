const express = require("express");
const router = express.Router();

const adminProtect = require("../../middlewares/adminAuthMiddleware"); 
const {
  createDesigController,
  getAllDesigController,
  getDesigByDeptController,
  updateDesigController,
  activateDesigController,
  deActivateDesigController,
} = require("../../controllers/admin/adminDesigController");

router.post("/create", adminProtect, createDesigController);
router.get("/", adminProtect, getAllDesigController);
router.get("/:deptId", adminProtect, getDesigByDeptController);
router.put("/update/:desigId", adminProtect, updateDesigController);
router.patch("/activate/:desigId", adminProtect, activateDesigController);
router.patch("/deactivate/:desigId", adminProtect, deActivateDesigController);


module.exports = router;
