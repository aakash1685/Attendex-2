const mongoose = require("mongoose");

const attendanceSchema = mongoose.Schema(
  {
    empId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
      index: true,
    },

    deptId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "dept",
      required: true,
      index: true,
    },

    date: {
      type: Date,
      required: true,
      index: true,
    },

    checkInTime: {
      type: Date,
    },

    checkOutTime: {
      type: Date,
    },

    attendanceStatus: {
      type: String,
      enum: ["PRESENT", "ABSENT", "HALF_DAY", "LEAVE"],
      default: "ABSENT",
      index: true,
    },
  },
  { timestamps: true }
);

//One attendance per emp per day
attendanceSchema.index({ empId: 1, date: 1 }, { unique: true });

module.exports = mongoose.model("attendance", attendanceSchema);
