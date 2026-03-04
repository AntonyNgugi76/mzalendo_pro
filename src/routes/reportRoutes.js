const express = require("express");
const router = express.Router();

const ReportController = require("../controllers/reportController");
const authMiddleware = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware");

router.get(
  "/monthly",
  authMiddleware,
  roleMiddleware("admin"),
  ReportController.monthlyReport
);

router.get(
  "/best-employee",
  authMiddleware,
  roleMiddleware("admin"),
  ReportController.bestEmployee
);

router.get(
  "/daily",
  authMiddleware,
  roleMiddleware("admin"),
  ReportController.dailyReport
);

module.exports = router;
