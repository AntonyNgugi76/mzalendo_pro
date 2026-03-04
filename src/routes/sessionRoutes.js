const express = require("express");
const router = express.Router();

const SessionController = require("../controllers/sessionController");
const authMiddleware = require("../middlewares/authMiddleware");

router.post("/clock-in", authMiddleware, SessionController.clockIn);

router.post("/clock-out", authMiddleware, SessionController.clockOut);

router.get("/active", authMiddleware, SessionController.getActiveSessions);

module.exports = router;
