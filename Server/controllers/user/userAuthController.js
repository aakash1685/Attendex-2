const {
  loginService,
  changePasswordService,
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

const changePasswordController = async(req,res) => {
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
}

module.exports = {
  loginController,
  changePasswordController
};
