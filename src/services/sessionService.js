const Session = require("../models/Session");
const DailyRecord = require("../models/DailyRecord");
const User = require("../models/User");
const NotificationService = require("./notificationService");

class SessionService {
  // CLOCK IN
  static async clockIn(employeeId, companyId) {
    const activeSession = await Session.findOne({
      employeeId,
      isActive: true,
    });

    if (activeSession) {
      throw new Error("Employee already has an active session");
    }

    const session = await Session.create({
      employeeId,
      companyId,
      clockIn: new Date(),
      isActive: true,
    });
    const adminUser = await User.findOne({
      companyId,
      role: "admin",
    });

    await NotificationService.sendNotification(
      adminUser.deviceToken,
      "Employee Clocked In",
      `Employee ${employeeId} started a session`
    );

    return session;
  }

  // CLOCK OUT
  static async clockOut(employeeId) {
    const session = await Session.findOne({
      employeeId,
      isActive: true,
    });

    if (!session) {
      throw new Error("No active session found");
    }

    const clockOutTime = new Date();

    const durationMs = clockOutTime - session.clockIn;
    const durationHours = durationMs / (1000 * 60 * 60);

    session.clockOut = clockOutTime;
    session.durationHours = durationHours;
    session.isActive = false;

    await session.save();

    const adminUser = await User.findOne({
      companyId: session.companyId,
      role: "admin",
    });

    await NotificationService.sendNotification(
      adminUser.deviceToken,
      "Employee Clocked Out",
      `Employee ${employeeId} ended a session`
    );

    await this.updateDailyRecord(employeeId, session.companyId, durationHours);

    return session;
  }

  // UPDATE DAILY RECORD
  static async updateDailyRecord(employeeId, companyId, hoursWorked) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let record = await DailyRecord.findOne({
      employeeId,
      companyId,
      date: today,
    });

    if (!record) {
      record = await DailyRecord.create({
        employeeId,
        companyId,
        date: today,
        requiredHours: 8,
        workedHours: 0,
      });
    }

    record.workedHours += hoursWorked;

    if (record.workedHours < record.requiredHours) {
      record.deficitHours = record.requiredHours - record.workedHours;
    } else {
      record.deficitHours = 0;
    }

    await record.save();

    await this.rolloverDeficit(record);

    return record;
  }

  // ROLLOVER DEFICIT TO NEXT DAY
  static async rolloverDeficit(record) {
    if (record.deficitHours <= 0) return;

    const tomorrow = new Date(record.date);
    tomorrow.setDate(tomorrow.getDate() + 1);

    let nextDayRecord = await DailyRecord.findOne({
      employeeId: record.employeeId,
      date: tomorrow,
    });

    if (!nextDayRecord) {
      nextDayRecord = await DailyRecord.create({
        employeeId: record.employeeId,
        companyId: record.companyId,
        date: tomorrow,
        requiredHours: 8 + record.deficitHours,
      });
    } else {
      nextDayRecord.requiredHours = 8 + record.deficitHours;
      await nextDayRecord.save();
    }
  }

  // GET ACTIVE SESSIONS
  static async getActiveSessions(companyId) {
    return Session.find({
      companyId,
      isActive: true,
    }).populate("employeeId", "name email");
  }
}

module.exports = SessionService;
