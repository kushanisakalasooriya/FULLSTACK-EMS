import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

//login for employee & admin
//POST /api/auth/login
export const login = async (req, res) => {
    try {
        const { email, password, role_type } = req.body;

        if(!email || !password){
            return res.status(400).json({ error: "email & password are required" });
        }
        
        const user = await User.findOne({ email })
        if(!user) {
            return res.status(401).json({ error: "invalid credentials" });
        }
        
        if (role_type === "admin" && role_type !== "ADMIN") {
            return res.status(401).json({ error: "Not authorized as admin" });
        }

        if (role_type === "employee" && role_type !== "EMPLOYEE") {
            return res.status(401).json({ error: "Not authorized as employee" });
        }

        const isValid = await bcrypt.compare(password, user.password);

        if(!isValid){
            return res.status(401).json({ error: "invalid credentials" });
        } 

        const payLoad = {
            userId: user._id.toString(),
            email: user.email,
            role: user.role,
        }
        
        //create token
        const token = jwt.sign(payLoad, process.env.JWT_SECRET, { expiresIn: "7d" });

        return res.status(200).json({ user: payLoad, token });

    } catch (error) {
        return res.status(500).json({ error: "Failed to login" });
    }
}

//get session for employee 7 admin
// GET /api/auth/session
export const Session = async (req, res) => {
    const session = req.session;
    return res.json({ user: session });
}

// change password for employee & admin
// POST /api/auth/change-password
export const changePassword = async (req, res) => {
    try {
        const session = req.session;
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({ error: "currentPassword & newPassword are required" });
        }

        const user = await User.findById(session.userId);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: "Current password is incorrect" });
        }

        const hashed = await bcrypt.hash(newPassword, 10);
        await user.findByIdAndUpdate(session.userId, { password: hashed });

        return res.status(200).json({ success: true, message: "Password changed successfully" });
    } catch (error) {
        return res.status(500).json({ error: "Failed to change password" });
    }
}