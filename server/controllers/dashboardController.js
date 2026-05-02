

// get dashboard for employee and admin

import { DEPARTMENTS } from "../constants/departments.js";
import Attendance from "../models/Attendance.js";
import Employee from "../models/Employee.js";
import leaveApplication from "../models/LeaveApplication.js";
import Payslip from "../models/Payslip.js";

// GET /api/dashboard
export const getDashboard = async (req, res) => {
    try {
        const session = req.session;
        const isAdmin = session.role === "ADMIN";
        if(isAdmin) {
           const [totalEmployees, totalLeaves, totalPayslips] = await Promise.all([
                Employee.countDocuments({isDelted: {$ne: true}}),
                Attendance.countDocuments({
                    date: {
                        $gte: new Date(new Date(new Date().setHours(0, 0, 0, 0))),
                        $lt: new Date(new Date(new Date().setHours(24, 0, 0, 0)))
                    }
                }),
                leaveApplication.countDocuments({status: "PENDING"})
            ]);

            return res.json({ 
                role: "ADMIN",
                totalEmployees, 
                totalDepartments: DEPARTMENTS.length, 
                totalAttendance, 
                pendingLeaves
            });


        }
        else {
            const employee = await Employee.findOne({ userId: session.userId }).lean();

            if (!employee) {
                return res.status(400).json({ error: "Employee profile not found for the authenticated user" });
            }

            const today = new Date();
            const [currentMonthAttendance, pendingLeaves, latestPayslip] = await Promise.all([
                Attendance.countDocuments({ 
                    employeeId: employee._id, 
                    date: {
                        $gte: new Date(new Date(today.getFullYear(), today.getMonth(), 1)),
                        $lt: new Date(new Date(today.getFullYear(), today.getMonth() + 1, 1))
                    }   
                }),
                leaveApplication.countDocuments({ 
                    employeeId: employee._id,
                    status: "PENDING" 
                }),
                Payslip.findOne({ employeeId: employee._id }).sort({ createdAt: -1 }).lean()
            ]);

            return res.json({
                role: "EMPLOYEE",
                employee: {
                    ...employee,
                    id: employee._id.toString()
                },
                currentMonthAttendance,
                pendingLeaves,
                latestPayslip: latestPayslip ? {
                    ...latestPayslip,
                    id: latestPayslip._id.toString()
                } : null
            });


        }


    } catch (error) {
        console.error("Error fetching dashboard data:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
}
