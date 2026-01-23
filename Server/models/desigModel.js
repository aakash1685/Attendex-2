const mongoose = require("mongoose");

const desigSchema = mongoose.Schema(
  {
    desigName: {
      type: String,
      required: true,
      trim: true,
    },
    activeStatus: {
      type: Boolean,
      default: true,
      index: true,
    },
    dept: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "dept",
      required: true,
    },
  },
  { timestamps: true },
);

desigSchema.index({ desigName: 1, dept: 1 }, { unique: true });

module.exports = mongoose.model("desig", desigSchema);
