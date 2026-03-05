require("dotenv").config();
const express = require("express");
const cors = require("cors");
const runRolloverJob = require("./src/jobs/rolloverJobs");

const connectDB = require("./src/configs/db");

const authRoutes = require("./src/routes/authRoutes");
const employeeRoutes = require("./src/routes/employeeRoutes");
const sessionRoutes = require("./src/routes/sessionRoutes");
const reportRoutes = require("./src/routes/reportRoutes");
const dashboardRoutes = require("./src/routes/dashboardRoutes");

const app = express();

connectDB();
runRolloverJob();

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/employees", employeeRoutes);
app.use("/api/sessions", sessionRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/dashboard", dashboardRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
