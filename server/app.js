import express from "express";
import cors from "cors";
import multer from "multer";
import authRouter from "./routes/authRoute.js";
import employeesRouter from "./routes/employeeRoutes.js";
import profileRouter from "./routes/profileRoutes.js";
import attendanceRouter from "./routes/attendanceRoutes.js";
import leaveRouter from "./routes/leaveRoutes.js";
import payslipsRouter from "./routes/payslipRouts.js";
import dashboardRouter from "./routes/dashboardRoutes.js";
import { serve } from "inngest/express";
import { inngest, functions } from "./inngest/index.js";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(multer().none());

// Routes
app.get("/", (req, res) => {
  res.send("server is running");
});
app.use("/api/auth", authRouter);
app.use("/api/employees", employeesRouter);
app.use("/api/profile", profileRouter);
app.use("/api/attendance", attendanceRouter);
app.use("/api/leave", leaveRouter);
app.use("/api/payslips", payslipsRouter);
app.use("/api/dashboard", dashboardRouter);
app.use("/api/inngest", serve({ client: inngest, functions }));

export default app;
