const SessionService = require("../services/SessionService");

class SessionController {
  // CLOCK IN
  static async clockIn(req, res) {
    try {
      const employeeId = req.user.id;
      const companyId = req.user.companyId;

      const session = await SessionService.clockIn(employeeId, companyId);

      res.status(200).json({
        success: true,
        data: session,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  // CLOCK OUT
  static async clockOut(req, res) {
    try {
      const employeeId = req.user.id;

      const session = await SessionService.clockOut(employeeId);

      res.status(200).json({
        success: true,
        data: session,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  // ACTIVE SESSIONS
  static async getActiveSessions(req, res) {
    try {
      const companyId = req.user.companyId;

      const sessions = await SessionService.getActiveSessions(companyId);

      res.status(200).json({
        success: true,
        data: sessions,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
}

module.exports = SessionController;
