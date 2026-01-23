const express = require("express");
const router = express.Router();
const adminProtect = require("../../middlewares/adminAuthMiddleware");
const upload = require("../../middlewares/uploadMiddleware");
const {
  createUserController,
  editUserController,
  deactiveUserController,
  getAllusersController,
  getAllDeactiveUsersController,
} = require("../../controllers/admin/adminUserController");

router.get("/", adminProtect, getAllusersController);
router.get(
  "/get-all-deactivate-users",
  adminProtect,
  getAllDeactiveUsersController, 
);
router.post(
  "/create",
  adminProtect,
  upload.single("profilePic"),
  createUserController,
);
router.put(
  "/edit/:userId",
  adminProtect,
  upload.single("profilePic"),
  editUserController,
);
router.patch("/deactive-user/:userId", adminProtect, deactiveUserController);

module.exports = router;
