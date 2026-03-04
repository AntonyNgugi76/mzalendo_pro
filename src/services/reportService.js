const DailyRecord = require("../models/DailyRecord");
const Session = require("../models/Session");
const User = require("../models/User");
const mongoose = require("mongoose");

class ReportService {
  // MONTHLY REPORT

  static async getMonthlyReport(companyId, month, year) {
    const start = new Date(year, month - 1, 1);
    const end = new Date(year, month, 0);

    const report = await DailyRecord.aggregate([
      {
        $match: {
          companyId: new mongoose.Types.ObjectId(companyId),
          date: { $gte: start, $lte: end },
        },
      },

      {
        $group: {
          _id: "$employeeId",
          totalHours: { $sum: "$workedHours" },
        },
      },

      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "employee",
        },
      },

      { $unwind: "$employee" },

      {
        $project: {
          name: "$employee.name",
          totalHours: 1,
        },
      },

      { $sort: { totalHours: -1 } },
    ]);

    return report;
  }

  // BEST EMPLOYEE

  static async getBestEmployee(companyId, month, year) {
    const start = new Date(year, month - 1, 1);
    const end = new Date(year, month, 0);

    const records = await DailyRecord.aggregate([
      {
        $match: {
          companyId: new mongoose.Types.ObjectId(companyId),
          date: { $gte: start, $lte: end },
        },
      },
      {
        $group: {
          _id: "$employeeId",
          totalHours: { $sum: "$workedHours" },
        },
      },
      { $sort: { totalHours: -1 } },
      { $limit: 1 },
    ]);

    if (records.length === 0) return null;

    const employee = await User.findById(records[0]._id);

    return {
      employeeId: records[0]._id,
      name: employee?.name || "Unknown",
      totalHours: records[0].totalHours,
    };
  }

  static async getDailyReport(companyId) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const employees = await User.find({
      companyId,
      role: "employee",
    });

    const result = [];

    for (const employee of employees) {
      const record = await DailyRecord.findOne({
        employeeId: employee._id,
        date: today,
      });

      const activeSession = await Session.findOne({
        employeeId: employee._id,
        isActive: true,
      });

      const worked = record?.workedHours || 0;
      const required = record?.requiredHours || 8;

      result.push({
        employeeId: employee._id,
        name: employee.name,
        workedHours: worked,
        requiredHours: required,
        deficit: Math.max(required - worked, 0),
        isLive: !!activeSession,
      });
    }

    return result;
  }
}

module.exports = ReportService;
