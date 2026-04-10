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
      index: true
    },

    leaveType : {
      type : String,
      enum : ["CL", "SL", "PL", "LOP"],
      required : true,
      index : true
    },

    reason: {
      type: String,
      required: true,
      trim: true,
      minlength: 5,
    },

    leaveDates: {
      type: [Date],
      required: true,
      validate: {
        validator: (v) => v.length > 0,
        message: "At least one leave date is required",
      },
      index: true,
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
  { timestamps: true },
);
leavesSchema.index({ empId: 1, leaveDates: 1 });
module.exports = mongoose.model("leave", leavesSchema);
