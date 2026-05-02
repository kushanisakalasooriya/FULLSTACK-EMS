import mongoose from "mongoose";

const PayslipSchema = new mongoose.Schema({
    employeeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: true},
    month: { type: Number, default: 0 },
    year: { type: Number, default: 0 },
    basicSalary: { type: Number, default: 0 },
    allowances: { type: Number, default: 0 },
    deductions: { type: Number, default: 0 },
    netSalary: { type: Number, default: 0 }
}, { timestamps: true });

const Payslip = mongoose.models.Payslip || mongoose.model('Payslip', PayslipSchema);

export default Payslip;