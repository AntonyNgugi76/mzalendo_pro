const EmployeeService = require("../services/employeeService");

class EmployeeController {
  // CREATE EMPLOYEE
  static async createEmployee(req, res) {
    try {
      const companyId = req.user.companyId;

      const employee = await EmployeeService.createEmployee(
        companyId,
        req.body
      );

      res.status(201).json({
        success: true,
        data: employee,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  // GET EMPLOYEES
  static async getEmployees(req, res) {
    try {
      const companyId = req.user.companyId;

      const employees = await EmployeeService.getCompanyEmployees(companyId);

      res.status(200).json({
        success: true,
        data: employees,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  // EMPLOYEE PERFORMANCE
  static async getEmployeePerformance(req, res) {
    try {
      const { employeeId } = req.params;

      const performance = await EmployeeService.getEmployeePerformance(
        employeeId
      );

      res.status(200).json({
        success: true,
        data: performance,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
  static async updateDeviceToken(req, res) {
    try {
      const userId = req.user.id;
      const { token } = req.body;

      const user = await EmployeeService.updateDeviceToken(userId, token);

      res.status(200).json({
        success: true,
        data: user,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
}
module.exports = EmployeeController;
