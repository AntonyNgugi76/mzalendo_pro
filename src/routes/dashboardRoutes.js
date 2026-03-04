const express = require("express");
const router = express.Router();

const DashboardController = require("../controllers/dashboardController");
const authMiddleware = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware");

router.get(
  "/",
  authMiddleware,
  roleMiddleware("admin"),
  DashboardController.getDashboard
);

module.exports = router;
