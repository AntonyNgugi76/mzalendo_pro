const User = require("../models/User");
const DailyRecord = require("../models/DailyRecord");
const bcrypt = require("bcryptjs");

class EmployeeService {
  static async createEmployee(companyId, data) {
    const hashedPassword = await bcrypt.hash(data.password, 10);

    const employee = await User.create({
      companyId,
      name: data.name,
      email: data.email,
      password: hashedPassword,
      role: "employee",
    });

    return employee;
  }

  static async getCompanyEmployees(companyId) {
    return User.find({
      companyId,
      role: "employee",
    }).select("-password");
  }

  static async getEmployeePerformance(employeeId) {
    const records = await DailyRecord.find({
      employeeId,
    });

    let totalHours = 0;

    records.forEach((r) => {
      totalHours += r.workedHours;
    });

    return {
      employeeId,
      totalHours,
    };
  }

  static async updateDeviceToken(userId, token) {
    return User.findByIdAndUpdate(
      userId,
      { deviceToken: token },
      { new: true }
    );
  }
}
module.exports = EmployeeService;
