const express = require("express");
const router = express.Router();

const EmployeeController = require("../controllers/employeeController");
const authMiddleware = require("../middlewares/authMiddleware");

const roleMiddleware = require("../middlewares/roleMiddleware");

router.post(
  "/",
  authMiddleware,
  roleMiddleware("admin"),
  EmployeeController.createEmployee
);
router.get("/", authMiddleware, EmployeeController.getEmployees);

router.get(
  "/performance/:employeeId",
  authMiddleware,
  EmployeeController.getEmployeePerformance
);
router.post(
  "/device-token",
  authMiddleware,
  EmployeeController.updateDeviceToken
);

module.exports = router;
