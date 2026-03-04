const User = require("../models/User");
const Session = require("../models/Session");
const DailyRecord = require("../models/DailyRecord");

class DashboardService {
  static async getDashboard(companyId) {
    const totalEmployees = await User.countDocuments({
      companyId,
      role: "employee",
    });

    const activeSessions = await Session.countDocuments({
      companyId,
      isActive: true,
    });

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayRecords = await DailyRecord.find({
      companyId,
      date: today,
    });

    let todayHours = 0;

    todayRecords.forEach((r) => {
      todayHours += r.workedHours;
    });

    const bestEmployee = await DailyRecord.aggregate([
      {
        $match: { companyId },
      },
      {
        $group: {
          _id: "$employeeId",
          totalHours: { $sum: "$workedHours" },
        },
      },
      {
        $sort: { totalHours: -1 },
      },
      {
        $limit: 1,
      },
    ]);

    return {
      totalEmployees,
      activeSessions,
      todayHours,
      bestEmployee: bestEmployee[0] || null,
    };
  }
}

module.exports = DashboardService;
