import Employee from "../models/Employee";

//clock in/out for employee
// POST /api/attendance
export const clockInOut = async (req, res) => {
    try {
        const session = req.session;
        const employee = await Employee.findOne({ userId: session.userId });

        if (!employee) {
            return res.status(400).json({ error: "Employee profile not found for the authenticated user" });
        }

        if(employee.isDeleted) {
            return res.status(403).json({ error: "your account is deactivated. you cannot clock in or out" });
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0); // Set time to the start of the day
        const exsiting = await Attendance.findOne({ employeeId: employee._id, date: today });

        const now = new Date();

        if (!exsiting) {
            const isLate = now.getHours() > 9 || (now.getHours() === 9 && now.getMinutes() > 0);
            const attendance = await Attendance.create({
                employeeId: employee._id,
                date: today,
                checkIn: now,
                status: isLate ? "LATE" : "PRESENT",
            });
            return res.status(200).json({ success: true, type:"CHECK_IN", data: attendance });
        }
        else if (!exsiting.checkOut) {
            const checkInTime = new Date(exsiting.checkIn).getTime();
            const diffMs = now.getTime() - checkInTime;
            const diffHours = diffMs / (1000 * 60 * 60);

            exsiting.checkOut = now;

            // compute working hours and day type
            const workingHours = parseFloat(diffHours.toFixed(2));
            let dayType = "Short Day";
            if (workingHours >= 8) {
                dayType = "Full Day";
            }
            else if (workingHours >= 6) {
                dayType = "Three Quarter Day";
            }
            else if (workingHours >= 4) {
                dayType = "Half Day";
            }
            else {
                dayType = "Short Day";  
            }

            exsiting.workingHours = workingHours;
            exsiting.dayType = dayType;
            await exsiting.save();
        }
        else {
            return res.status(200).json({ success: true, type:"CHECK_OUT", data: exsiting });
        }

    } catch (error) {
        res.status(500).json({ message: "Error occurred while clocking in/out" });
    }
}

// get attendance for employee
// GET /api/attendance

export const getAttendance = async (req, res) => {
    try {
        const session = req.session;
        const employee = await Employee.findOne({ userId: session.userId });

        if (!employee) {
            return res.status(400).json({ error: "Employee profile not found for the authenticated user" });
        }

        const limit = parseInt(req.query.limit) || 30;
        const history = await Attendance.find({ employeeId: employee._id }).sort({ date: -1 }).limit(limit);

        return res.status(200).json({
            data: history,
            employee: {
                isDeleted: employee.isDeleted
            }
        });
    } catch (error) {
        res.status(500).json({ message: "Error occurred while fetching attendance" });
    }
}