const userModel = require("../../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const loginService = async (body) => {
  const { email, password } = body;

  if (!email || !password) {
    return {
      success: false,
      status: 400,
      message: "Email & Password are required!",
    };
  }

  const user = await userModel.findOne({ email });

  if (!user) {
    return {
      success: false,
      status: 404,
      message: "Employee not found",
    };
  }

  if (!user.activeStatus) {
    return {
      success: false,
      status: 403,
      message: "Your account is deactivated, Contact Admin",
    };
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    return {
      success: false,
      status: 401,
      message: "Invalid credentials",
    };
  }

  const token = jwt.sign(
    {
      _id: user._id,
      deptId: user.dept,
    },
    process.env.USER_SECRET_KEY,
    { expiresIn: "1d" },
  );

  return {
    success: true,
    status: 200,
    message: "Login successfull",
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
    },
  };
};

const changePasswordService = async (user, body) => {
  const { oldPassword, newPassword } = body;

  if (!oldPassword || !newPassword) {
    return {
      success: false,
      status: 400,
      message: "Old password and new password are required!",
    };
  }

  const existUser = await userModel.findById(user._id);
  if (!existUser) {
    return {
      success: false,
      status: 404,
      message: "User not found",
    };
  }

  const isMatch = await bcrypt.compare(oldPassword, existUser.password);
  if (!isMatch) {
    return {
      success: false,
      status: 401,
      message: "Old password is incorrect",
    };
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  existUser.password = hashedPassword;
  existUser.isFirstLogin = false;
  await existUser.save();

  return {
    success: true,
    status: 200,
    message: "Password changed successfully",
  };
};

module.exports = {
  loginService,
  changePasswordService,
};
