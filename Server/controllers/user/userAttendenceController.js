const {
  checkInService,
  checkOutService,
} = require("../../services/user/userAttendenceService");

const checkInController = async (req, res) => {
  try {
    const result = await checkInService(req);
    return res.status(result.status).json(result);
  } catch (error) {
    console.log("CHECK-IN ERROR: ", error);
    return {
      status: 500,
      success: false,
      message: "Internal server error",
    };
  }
};

const checkOutController = async (req, res) => {
  try {
    const result = await checkOutService(req);
    return res.status(result.status).json(result);
  } catch (error) {
    console.log("CHECK-OUT ERROR: ", error);
    return {
      status: 500,
      success: false,
      message: "Internal server error",
    };
  }
};

module.exports = {
  checkInController,
  checkOutController,
};
