const AuthService = require("../services/authService");

class AuthController {
  static async login(req, res) {
    try {
      const { email, password } = req.body;

      const result = await AuthService.login(email, password);

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }
  static async registerCompany(req, res) {
    console.log("Registering company with data:", req.body);
    try {
      const result = await AuthService.registerCompany(req.body);

      res.status(201).json({
        success: true,
        data: result,
      });
    } catch (error) {
      console.error("Error in registerCompany:", error);
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }
}
module.exports = AuthController;
