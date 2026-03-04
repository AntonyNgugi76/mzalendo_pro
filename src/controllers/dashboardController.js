const DashboardService = require("../services/dashboardService");

class DashboardController {
  static async getDashboard(req, res) {
    try {
      const companyId = req.user.companyId;

      const dashboard = await DashboardService.getDashboard(companyId);

      res.status(200).json({
        success: true,
        data: dashboard,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
}

module.exports = DashboardController;
