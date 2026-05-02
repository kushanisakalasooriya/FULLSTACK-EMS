
// get dashboard for employee and admin

import { DEPARTMENTS } from "../constants/departments.js";
import Attendance from "../models/Attendance.js";
import Employee from "../models/Employee.js";
import leaveApplication from "../models/LeaveApplication.js";
import Payslip from "../models/Payslip.js";
import User from "../models/User.js";

/** Start of local calendar day / next midnight (same logic as attendance clock-in). */
function localDayBounds(d = new Date()) {
    const start = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0, 0);
    const end = new Date(start);
    end.setDate(end.getDate() + 1);
    return { start, end };
}

// GET /api/dashboard
export const getDashboard = async (req, res) => {
    try {
        const session = req.session;
        const isAdmin = session.role === "ADMIN";
        if (isAdmin) {
            const { start, end } = localDayBounds();

            // Not deleted: treat missing isDeleted like false
            const notDeleted = { $nor: [{ isDeleted: true }] };

            let totalEmployees = await Employee.countDocuments(notDeleted);
            if (totalEmployees === 0) {
                totalEmployees = await User.countDocuments({ role: "EMPLOYEE" });
            }

            // Use aggregation instead of distinct() — MongoDB API Version 1 (strict) disallows distinct
            const deptGroups = await Employee.aggregate([
                {
                    $match: {
                        ...notDeleted,
                        department: { $exists: true, $nin: [null, ""] },
                    },
                },
                { $group: { _id: "$department" } },
            ]);
            const uniqueDeptCount = deptGroups.filter((g) => g._id != null && g._id !== "").length;
            const totalDepartments =
                uniqueDeptCount > 0 ? uniqueDeptCount : DEPARTMENTS.length;

            // date is normalized at clock-in; older rows may only align via checkIn
            const todayAttendance = await Attendance.countDocuments({
                $or: [
                    { date: { $gte: start, $lt: end } },
                    { checkIn: { $gte: start, $lt: end } },
                ],
            });

            const pendingLeaves = await leaveApplication.countDocuments({
                status: { $regex: /^PENDING$/i },
            });

            return res.json({
                role: "ADMIN",
                totalEmployees,
                totalDepartments,
                todayAttendance,
                pendingLeaves,
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
                    status: { $regex: /^PENDING$/i } 
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
