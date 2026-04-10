const {
  loginService,
  changePasswordService,
  forgotPasswordService,
  resetPasswordService,
  getProfileService,
  getEmpCalendarService,
} = require("../../services/user/userAuthService");

const loginController = async (req, res) => {
  try {
    const result = await loginService(req.body);
    return res.status(result.status).json(result);
  } catch (error) {
    console.log("Error: ", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const changePasswordController = async (req, res) => {
  try {
    const result = await changePasswordService(req.user, req.body);
    return res.status(result.status).json(result);
  } catch (error) {
    console.log("Error: ", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const getProfileController = async (req, res) => {
  try {
    const result = await getProfileService(req.user);
    return res.status(result.status).json(result);
  } catch (error) {
    console.log("GET PROFILE ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const forgotPasswordController = async (req, res) => {
  try {
    const result = await forgotPasswordService(req.body.email);
    return res.status(result.status).json(result);
  } catch (error) {
    console.log("FORGOT PASSWORD ERROR:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server error" });
  }
};

const resetPasswordController = async (req, res) => {
  try {
    const result = await resetPasswordService(
      req.params.token,
      req.body.newPassword,
    );
    return res.status(result.status).json(result);
  } catch (error) {
    console.log("RESET PASSWORD ERROR:", error);
    return res.status(500).json({ success: false, message: "Internal Server error" });
  }
};

const getEmpCalendarController = async(req,res) => {
  try {
    const result = await getEmpCalendarService(req.user, req.query);
    return res.status(result.status).json(result);
  } catch (error) {
    console.error("CALENDAR CONTROLLER ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}

module.exports = {
  loginController,
  changePasswordController,
  getProfileController,
  forgotPasswordController,
  resetPasswordController,
  getEmpCalendarController,
};
