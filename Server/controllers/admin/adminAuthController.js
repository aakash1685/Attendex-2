const jwt = require("jsonwebtoken");
const { loginService } = require("../../services/admin/adminAuthService");

const loginController = async (req, res) => {
  const { email, password } = req.body;
  const result = await loginService(email, password);

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
