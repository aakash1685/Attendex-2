const jwt = require("jsonwebtoken");
const { loginService } = require("../../services/admin/adminAuthService");

const loginController = async (req, res) => {
  const { email, password } = req.body || {};
  const result = await loginService(email, password);

  if (!result.success) {
    return res.status(result.status).json({
      success: result.success,
      message: result.message,
    });
  }

  if (!process.env.ADMIN_SECRET_KEY) {
    return res.status(500).json({
      success: false,
      message: "ADMIN_SECRET_KEY is not configured",
    });
  }

  const token = jwt.sign(
    { email: result.data.email, role: result.data.role },
    process.env.ADMIN_SECRET_KEY,
    { expiresIn: "1d" },
  );

  return res.status(result.status).json({
    success: result.success,
    message: result.message,
    token,
  });
};

const logoutController = async (req, res) => {
  return res.status(200).json({
    success: true,
    message: "Admin logged out successfully",
  });
};

module.exports = {
  loginController,
  logoutController,
};
