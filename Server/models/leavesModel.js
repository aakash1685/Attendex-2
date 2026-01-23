const mongoose = require("mongoose");

const leavesSchema = mongoose.Schema(
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

    reason: {
      type: String,
      required: true,
      trim: true,
      minlength: 5,
    },

    totalDays: {
      type: Number,
      required: true,
      min: 1,
    },

    startDate: {
      type: Date,
      required: true,
    },

    endDate: {
      type: Date,
      required: true,
    },

    leaveStatus: {
      type: String,
      enum: ["PENDING", "APPROVED", "REJECTED"],
      default: "PENDING",
      index: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("leave", leavesSchema);
