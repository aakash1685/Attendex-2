const mongoose = require("mongoose");

const deptSchema = mongoose.Schema(
  {
    deptName: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    activeStatus: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("dept", deptSchema);