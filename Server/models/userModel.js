const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minLength: 2,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      minLength: 3,
    },

    mobileNo: {
      type: Number,
      required: true,
      unique: true,
    },

    address: {
      type: String,
      trim: true,
    },
    profilePic: {
      type: String,
      default: "",
    },

    dept: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "dept",
      required: true,
    },

    designation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "desig",
      required: true,
    },

    leaves: {
      CL: {
        total: { type: Number, default: 10 },
        used: { type: Number, default: 0 },
        remaining: { type: Number, default: 10 },
      },
      SL: {
        total: { type: Number, default: 8 },
        used: { type: Number, default: 0 },
        remaining: { type: Number, default: 8 },
      },
      PL: {
        total: { type: Number, default: 15 },
        used: { type: Number, default: 0 },
        remaining: { type: Number, default: 15 },
      },
      LOP: {
        total: { type: Number, default: 0 },
        used: { type: Number, default: 0 },
        remaining: { type: Number, default: 0 },
      },
    },

    gender: {
      type: String,
      enum: ["MALE", "FEMALE", "OTHER"],
    },

    bank: {
      accNo: {
        type: String,
        required: true,
      },
      ifsc: {
        type: String,
      },
    },

    salary: {
      type: Number,
      default: 0,
    },

    isFirstLogin: {
      type: Boolean,
      default: true,
    },

    activeStatus: {
      type: Boolean,
      default: true,
    },

    resetPasswordToken: {
      type: String,
    },

    resetPasswordExpire: {
      type: String,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("user", userSchema);
