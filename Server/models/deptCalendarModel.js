const mongoose = require("mongoose");

const monthSchema = mongoose.Schema(
  {
    month: {
      type: String,
      enum: [
        "JANUARY",
        "FEBRUARY",
        "MARCH",
        "APRIL",
        "MAY",
        "JUNE",
        "JULY",
        "AUGUST",
        "SEPTEMBER",
        "OCTOBER",
        "NOVEMBER",
        "DECEMBER",
      ],
      required: true,
    },
    holidays: [
      {
        date: { type: Date },
        title: { type: String },
      },
    ],
    workingDaysOverride: [
      {
        date: { type: Date },
        reason: { type: String },
      },
    ],
  },
  { _id: false },
);

const deptCalendarSchema = mongoose.Schema(
  {
    deptId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "dept",
      required: true,
      index: true,
    },
    year: {
      type: Number,
      required: true,
      index: true,
    },

    weeklyOff: {
      type: [String],
      enum: [
        "SUNDAY",
        "MONDAY",
        "TUESDAY",
        "WEDNESDAY",
        "THURSDAY",
        "FRIDAY",
        "SATURDAY",
      ],
      required: true,
    },

    months: {
      type: [monthSchema],
      validate: [
        {
          validator: function (v) {
            return v.length === 12;
          },
          message: "Exactly 12 months are required",
        },
        {
          validator: function (v) {
            const monthsNames = v.map((m) => m.month);
            return new Set(monthsNames).size === 12;
          },
          message: "All 12 months must be unique",
        },
      ],
    },
  },
  { timestamps: true },
);

deptCalendarSchema.index({ deptId: 1, year: 1 }, { unique: true });

module.exports = mongoose.model("deptCalendar", deptCalendarSchema);
