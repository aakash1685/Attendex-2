const mongoose = require("mongoose");

const leaveBalanceSchema = mongoose.Schema({
  empId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
    unique: true
  },

  CL: {
    total: { type: Number, default: 6 },
    used: { type: Number, default: 0 },
    remaining: { type: Number, default: 6 }
  },

  SL: {
    total: { type: Number, default: 6 },
    used: { type: Number, default: 0 },
    remaining: { type: Number, default: 6 }
  },

  PL: {
    total: { type: Number, default: 12 },
    used: { type: Number, default: 0 },
    remaining: { type: Number, default: 12 }
  }

}, { timestamps: true });

module.exports = mongoose.model("leaveBalance", leaveBalanceSchema);