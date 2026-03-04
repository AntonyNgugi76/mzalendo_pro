const mongoose = require("mongoose");

const DailyRecordSchema = new mongoose.Schema({
  employeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Company",
  },

  date: {
    type: Date,
    required: true,
  },

  requiredHours: {
    type: Number,
    default: 8,
  },

  workedHours: {
    type: Number,
    default: 0,
  },

  deficitHours: {
    type: Number,
    default: 0,
  },
});

module.exports = mongoose.model("DailyRecord", DailyRecordSchema);
