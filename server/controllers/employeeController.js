import Employee from "../models/Employee.js";
import User from "../models/User.js";
import bcrypt from "bcrypt";

//Get Employee
//GET /api/employees
export const getEmployees = async (req, res) => {
    try {
        const {department} = req.query;
        const where = {};

        if(department){
            where.department = department;
        }

        const employees = (await Employee.find(where)).toSorted({createdAt: -1}).populate('userId', 'email role').lean();

        const result = employees.map((emp) => ({
                ...emp,
                id: emp._id.toString(),
                user: emp.userId ? {
                    email: emp.userId.email,
                    role: emp.userId.role,
                } : null
        }));

        return res.status(200).json(employees);
    } catch (error) {
        return res.status(500).json({ error: "Failed to fetch employees" });
    }
};

//create Employee
//POST /api/employees
export const createEmployees = async (req, res) => {
    try {
        const {firstName, lastName, email, phone, position, department, basicSalary, allowances, deductions, joinDate, password, role, bio } = req.body;

        if (!email || !password || !firstName || !lastName){
            return res.status(400).json({ error: "Missing required fields" });
        }

        //encrypt the password
        const hashed = await bcrypt.hash(password, 10);
        const user = await User.create({ 
            email, 
            password: hashed, 
            role: role || 'EMPLOYEE' 

        });

        const employee = await Employee.create({
            userId: user._id,
            firstName,
            lastName,
            email,
            phone,
            position,
            department: department || "Engineering",
            basicSalary: Number(basicSalary) || 0,
            allowances: Number(allowances) || 0,
            deductions: Number(deductions) || 0,
            joinDate: new Date(joinDate) || new Date(),
            bio: bio || "",
        });

        return res.status(201).json(savedEmployee);
    } catch (error) {
        if(error.code === 11000){
            return res.status(400).json({ error: "Email already exists" });
        }
        console.error("Error creating employee:", error);
        return res.status(500).json({ error: "Failed to fetch employees" });
    }
};

//update Employee
//PUT /api/employees/:id
export const updateEmployee = async (req, res) => {
    try {
        const { id } = req.params;
        const {firstName, lastName, email, phone, position, department, basicSalary, allowances, deductions, password, role, bio, employementStatus } = req.body;

        const employee = await Employee.findById(id);
        if(!employee){
            return res.status(404).json({ error: "Employee not found" });
        }

        await Employee.findByIdAndUpdate(id, {
            firstName,
            lastName,
            email,
            phone,
            position,
            department: department || "Engineering",
            basicSalary: Number(basicSalary) || 0,
            allowances: Number(allowances) || 0,
            deductions: Number(deductions) || 0,
            employementStatus: employementStatus || "ACTIVE",
            bio: bio || "",
        });

        // update user records
        const userUpdate = {email};
        if(role){
            userUpdate.role = role;
        }
        if(password){
            userUpdate.password = await bcrypt.hash(password, 10);
        }

        await User.findByIdAndUpdate(employee.userId, userUpdate);

        return res.status(201).json({ success: true });
    } catch (error) {
        if(error.code === 11000){
            return res.status(400).json({ error: "Email already exists" });
        }
        return res.status(500).json({ error: "Failed to update employee" });
    }
};

//delete Employee
//DELETE /api/employees/:id
export const deleteEmployee = async (req, res) => {
    try {
        const { id } = req.params;
        const employee = await Employee.findById(id);
        if(!employee){
            return res.status(404).json({ error: "Employee not found" });
        }
        employee.isDeleted= true;
        employee.employeementStatus= "INACTIVE";

        await employee.save();

        return res.status(200).json({ success: true });
    } catch (error) {
        return res.status(500).json({ error: "Failed to delete employee" });
    }
};