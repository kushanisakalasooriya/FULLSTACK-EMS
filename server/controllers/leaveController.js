import { inngest } from "../inngest/index.js";
import Employee from "../models/Employee.js";
import leaveApplication from "../models/LeaveApplication.js";

// create leave
// POST /api/leaves
export const createLeave = async (req, res) => {
    try {
        const session = req.session;
        const employee = await Employee.findOne({ userId: session.userId });

        if (!employee) {
            return res.status(400).json({ error: "Employee profile not found for the authenticated user" });
        }

        if(employee.isDeleted) {
            return res.status(403).json({ error: "your account is deactivated. you cannot apply for leave" });
        }

        const {type, startDate, endDate, reason } = req.body;

        if(!type || !startDate || !endDate || !reason){
            return res.status(400).json({ error: "type, startDate, endDate and reason are required" });
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0); // Set time to the start of the day

        if (new Date(startDate) < today || new Date(endDate) < today) {
            return res.status(400).json({ error: "Invalid leave dates. Please select a future date." });
        }

        if (new Date(endDate) < new Date(startDate)) {
            return res.status(400).json({ error: "end date cannot be before start date." });
        }

        const leave = await leaveApplication.create({
            employeeId: employee._id,
            type,
            startDate: new Date(startDate),
            endDate: new Date(endDate),
            reason,
            status: "PENDING",
        });

        try {
            await inngest.send({
                name: "leave/pending",
                data: {
                    leaveApplicationId: leave._id
                }
            });
        } catch (inngestErr) {
            console.warn("Inngest leave/pending (non-fatal):", inngestErr?.message || inngestErr);
        }

        return res.status(201).json({success: true, message: "Leave application submitted successfully", data:leave });

    } catch (error) {
        console.error("Error creating leave:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
}

// get leave
// GET /api/leaves
export const getLeave = async (req, res) => {
    try {
        const session = req.session;
        const isAdmin = session.role === "ADMIN";

        if(isAdmin) {
            const status = req.query.status;
            const where = status ? { status } : {};
            const leaves = await leaveApplication.find(where).populate('employeeId').sort({ createdAt: -1 });
            const data = leaves.map((leave) => {
                const obj = leave.toObject();
                return {
                    ...obj,
                    id: obj._id.toString(),
                    employee: obj.employeeId,
                    employeeId: obj.employeeId?._id.toString()
                    } 
            });

            return res.status(200).json({data});
        }
        else {
            const employee = await Employee.findOne({ userId: session.userId }).lean();

            if (!employee) {
                return res.status(400).json({ error: "Employee profile not found for the authenticated user" });
            }

            const leaves = await leaveApplication.find({ employeeId: employee._id }).sort({ createdAt: -1 });

            return res.status(200).json({
                data: leaves, 
                employee: {
                    ...employee,
                    id: employee._id.toString()
                } 
            });
        }
    } catch (error) {
        console.error("Error fetching leave:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
}

// update leave status
// PATCH /api/leaves/:id
export const updateLeaveStatus = async (req, res) => {
    try {
        const {status} = req.body;
        if(!["APPROVED", "REJECTED", "PENDING"].includes(status)){
            return res.status(400).json({ error: "Invalid status. Status must be either APPROVED, REJECTED or PENDING" });
        }

        const leave = await leaveApplication.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );
        if (!leave) {
            return res.status(404).json({ error: "Leave application not found" });
        }
        return res.status(200).json({ success: true, message: "Leave status updated successfully", data: leave });
    } catch (error) {
        console.error("Error updating leave status:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
}