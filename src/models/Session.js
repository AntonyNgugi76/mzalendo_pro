const mongoose = require("mongoose");

const SessionSchema = new mongoose.Schema({
  employeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Company",
    required: true,
  },

  clockIn: {
    type: Date,
    required: true,
  },

  clockOut: {
    type: Date,
  },

  durationHours: {
    type: Number,
  },

  isActive: {
    type: Boolean,
    default: true,
  },
});

module.exports = mongoose.model("Session", SessionSchema);
