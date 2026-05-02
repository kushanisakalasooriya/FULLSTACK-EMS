import { Inngest } from "inngest";
import Attendance from "../models/Attendance.js";
import Employee from "../models/Employee.js";
import leaveApplication from "../models/LeaveApplication.js";
import sendEmail from "../config/nodemailer.js";

// Create a client to send and receive events
export const inngest = new Inngest({ id: "employee-management-system" });

//auto check-out for employees who forget to check out
const autoCheckout = inngest.createFunction(
  { id: "auto-checkout", triggers: { event: "employee/check-out" } },
  async ({ event, step }) => {
    const { employeeId, attendanceId } = event.data;

    //wait for 9hours after check-in
    await step.sleepUntil("wait-for-the-9-hours", new Date(new Date().getTime() + 9 * 60 * 60 * 1000));

    // get attendace data
    let attendance = await Attendance.findById(attendanceId);

    if (!attendance?.checkOut) {
        //get employee data
        const employee = await Employee.findById(employeeId);

        //send reminder email
        await sendEmail({
            to: employee.email,
            subject: "Attendence Check-Out Remainder",
            body: 
            `
                <div style="max-width: 600px;"> 
                    <h2> Hi ${employee.firstName} </h2>
                    <p style="font-size: 16px;"> You have a check-in in ${employee.department} today:</p>
                    <p style="font-size: 18px; font-weight: bold; color:#007bff; margin: 8px 0;">${attendance?. checkIn?. toLocaleTimeString()}</p>
                    <p style="font-size: 16px;"> Please make sure to check-out in one hour.</p>
                    <p style="font-size: 16px;"> If you have any questions, please contact your admin.</p> 
                    <br /> 
                    <p style="font-size: 16px;">Best Regards, </p> 
                    <p style="font-size: 16px;"> employee-management-system</p>
                </div>
            `
        })

        //after 10 hours mark attendance as checked out with status "LATE"
        await step.sleepUntil("wait-for-the-10-hours", new Date(new Date().getTime() + 1 * 60 * 60 * 1000));

        attendance = await Attendance.findById(attendanceId);

        if (!attendance?.checkOut) {
            attendance.checkOut = new Date(attendance.checkIn.getTime() + 4 * 60 * 60 * 1000);
            attendance.workingHours = 4;
            attendance.status = "LATE";
            attendance.dayType = "Half Day";
            await attendance.save();
        }


    }
  },
);

// leave application pending reminder - not get action within 24 hours
const leaveApplicationReminder = inngest.createFunction(
  { id: "leave-application-reminder", triggers: { event: "employee/leave-application-pending" } },
  async ({ event, step }) => {
    const {leaveApplicationId} = event.data;
    
    //wait for 24 hours
    await step.sleepUntil("wait-for-24-hours", new Date(new Date().getTime() + 24 * 60 * 60 * 1000));

    const leaveApplication = await leaveApplication.findById(leaveApplicationId);

    if(leaveApplication?.status === "PENDING") {
        const employee = await Employee.findById(leaveApplication.employeeId);
        
        //send reminder email to manager
        await sendEmail({
            to: process.env.ADMIN_EMAIL,
            subject: "Leave application Remainder",
            body: 
            `
                <div style="max-width: 600px;"> 
                    <h2> Hi Admin, </h2>
                    <p style="font-size: 16px;"> You have a leave application in ${employee.department} today:</p>
                    <p style="font-size: 18px; font-weight: bold; color:#007bff; margin: 8px 0;">${leaveApplication?. startDate?. toLocaleTimeString()}</p>
                    <p style="font-size: 16px;"> Please make sure to take action for this leave application.</p>
                    <br /> 
                    <p style="font-size: 16px;">Best Regards, </p> 
                    <p style="font-size: 16px;"> employee-management-system</p>
                </div>
            `
        })
    }
  },
);

// cron: check attendance at 11.30 am IST (06:00 UTC) and email absent employees
const attendenceReminderCron = inngest.createFunction (
  { id: "attendance-reminder-cron", 
    triggers: { cron: "0 0 6 * * *" } }, //every day at 6:00 UTC (11:30 am IST)
  async ({ event, step }) => {
    // step 1: get today date range (IST)
    const today = await step.run("get-today-date-range", async () => {
        const now = new Date();
        const startUTC = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
        const endUTC = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);
        return { startUTC: startUTC.toString(), endUTC: endUTC.toString() };
    });

    // step 2: get all non deleted active amployees
    const employees = await step.run("get-active-employees", async () => {
        const list = await Employee.find({ isDeleted: false, employmentStatus: "ACTIVE" }).lean();
        return list.map((emp) => ({
            id: emp._id.toString(),
            email: emp.email,
            firstName: emp.firstName,
            lastName: emp.lastName,
            department: emp.department,
        }));
    });

    // step 3: get employees ids on approved leave today
    const onLeavesIds = await step.run("get-employees-on-leave-today", async () => {
        const leaves = await leaveApplication.find({ 
            status: "APPROVED", 
            $or: [
                { startDate: { $lte: new Date(today.endUTC) }, endDate: { $gte: new Date(today.startUTC) } },
                { startDate: { $lte: new Date(today.endUTC) }, endDate: null }
            ]
        }).lean();
        return leaves.map(leave => leave.employeeId.toString());
    });

    // step 4: employees who checked in today
    const checkedInEmployeesIds = await step.run("get-checked-in-employees-today", async () => {
        const attendances = await Attendance.find({ 
            date: { $gte: new Date(today.startUTC), $lte: new Date(today.endUTC) }
        }).lean();
        return attendances.map(attendance => attendance.employeeId.toString());
    });

    // step 5: filter employees who are absent (not on leave and not checked in)
    const absentEmployees = employees.filter(
        (emp) => !onLeavesIds.includes(emp.id) && !checkedInEmployeesIds.includes(emp.id),
    );

    // step 6: send email to absent employees
    if (absentEmployees.length > 0) {
        await step.run("send-email-to-absent-employees", async () => {
            const emailPromises = absentEmployees.map(async (emp) => {
                // send email to employee
                await sendEmail({
                    to: emp.email,
                    subject: "Attendance Remainder - please Mark your attendance",
                    body: 
                    `
                        <div style="max-width: 600px; font-family:Arial, sans-serif;"> 
                            <h2>Hi ${emp.firstName}</h2>
                            <p style="font-size: 16px;"> We noticed you haven't marked your attendance yet today.</p>
                            <p style="font-size: 16px;"> The deadline was < strong>11:30 AM</strong> and your attendance is still missing.</p>
                            <p style="font-size: 16px;"> Please check in as soon as possible or contact your admin if you're facing any issues.</p>
                            <br />
                            <p style="font-size: 14px; color:#666;">Department: ${emp.department}</p>
                            <br />
                            <p style="font-size: 16px;">Best Regards,</ p>
                            <p style="font-size: 16px;"><strong>Employee-Managemnt-System</strong></p>
                        </div>
                    `
                });
            });

            await Promise.all(emailPromises);
        });
    }

    return {
      totalActive: employees.length,
      onLeave: onLeavesIds.length,
      checkedIn: checkedInEmployeesIds.length,
      absent: absentEmployees.length,
    };
  },
);

// Add the function to the exported array:
export const functions = [
  autoCheckout,
  leaveApplicationReminder,
  attendenceReminderCron,
];