const jwt = require("jsonwebtoken");
const { adminLoginService } = require("../../services/admin/adminAuthService");

const adminLoginController = async (req, res) => {
  const { email, password } = req.body;
  const result = await adminLoginService(email, password);

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


module.exports = {
  adminLoginController,
};
