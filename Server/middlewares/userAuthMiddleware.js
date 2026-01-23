const jwt = require("jsonwebtoken");
const userModel = require("../models/userModel");

const userProtect = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Token missing" });
    }

    const decoded = await jwt.verify(token, process.env.USER_SECRET_KEY);
    const user = await userModel.findById(decoded._id).select("-password");

    if (!user || !user.activeStatus) {
      return res.status(401).json({ message: "Unauthorised" });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};


module.exports = userProtect