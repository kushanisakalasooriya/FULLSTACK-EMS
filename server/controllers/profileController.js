import Employee from "../models/Employee.js";


//get profile
// GET /api/profile
export const getProfile = async (req, res) => {
    try {
        const session = req.session;
        const userId = session?.userId;
        const employee = await Employee.findOne({ userId });

        if(!employee) {
            // Authenticated user is not an employee - return admin profile
            return res.status(200).json({
                firstName: "Admin",
                lastName: "",
                email: session.email
            })
        } 

        return res.status(200).json(employee);

    } catch (error) {
        return res.status(500).json({ error: "Failed to fetch profile" });
    }
}

// update profile
// PUT /api/profile
export const updateProfile = async (req, res) => {
    try {
        const session = req.session;
        const userId = session?.userId;
        const employee = await Employee.findOne({ userId });

        if(!employee) {
            return res.status(400).json({ error: "Employee profile not found for the authenticated user" })
        } 
        if(!employee.isDeleted) {
            return res.status(403).json({ error: "your account is deactivated. you cannot update your profile" })
        } 

        await Employee.findOneAndUpdate( employee._id, { 
            bio: req.body.bio || employee.bio,
         });

        return res.status(200).json({ success: true });

    } catch (error) {
        return res.status(500).json({ error: "Failed to update profile" });
    }
}

