const ReportService = require("../services/reportService");

class ReportController {
  // MONTHLY REPORT
  static async monthlyReport(req, res) {
    try {
      const companyId = req.user.companyId;

      const { month, year } = req.query;

      const report = await ReportService.getMonthlyReport(
        companyId,
        parseInt(month),
        parseInt(year)
      );

      res.status(200).json({
        success: true,
        data: report,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  // BEST EMPLOYEE
  static async bestEmployee(req, res) {
    try {
      const companyId = req.user.companyId;

      const { month, year } = req.query;

      const best = await ReportService.getBestEmployee(
        companyId,
        parseInt(month),
        parseInt(year)
      );

      res.status(200).json({
        success: true,
        data: best || "No data available",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
  static async dailyReport(req, res) {
    try {
      const companyId = req.user.companyId;

      const report = await ReportService.getDailyReport(companyId);

      res.json({
        success: true,
        data: report,
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        message: err.message,
      });
    }
  }
}

module.exports = ReportController;
