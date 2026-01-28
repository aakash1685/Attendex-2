const express = require("express");
const router = express.Router();
const userProtect = require("../../middlewares/userAuthMiddleware");
const { 
    applyLeaveController,
    getMyLeavesController,
    getSingleLeaveController,
    cancelLeaveController
} = require("../../controllers/user/userLeavesController");

router.get("/", userProtect, getMyLeavesController); //GET ALL LEAVES WITH FILTER
router.get("/:leaveId", userProtect, getSingleLeaveController); //VIEW SINGLE LEAVE
router.post("/apply", userProtect, applyLeaveController); //APPLY LEAVE
router.delete("/:leaveId", userProtect, cancelLeaveController)



module.exports = router;
