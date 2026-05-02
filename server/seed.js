import "dotenv/config";
import connectDB from "./config/db.js";
import User from "./models/User.js";
import bcrypt from "bcrypt";

const TemporaryPassword = "admin123";

async function registereAdmin() {
    try {
        const ADMIN_EMAIL = process.env.ADMIN_EMAIL;

        if(!ADMIN_EMAIL) {
            console.error("Missing ADMIN_EMAIL. Add it to server/.env");
            process.exit(1);
        }

        await connectDB();
        const existingAdmin = await User.findOne({ email: ADMIN_EMAIL });

        if (existingAdmin) {
            console.log("Admin already exists.", existingAdmin.role);
            process.exit(0);
        }

        const hashedPassword = await bcrypt.hash(TemporaryPassword, 10);

        const admin = await User.create({
            email: ADMIN_EMAIL,
            password: hashedPassword,
            role: "ADMIN"
        });

        console.log("Admin registered successfully.");
        process.exit(0);
    } catch (error) {
        console.error("Error occurred while registering admin:", error);
        process.exit(1);
    }
}

registereAdmin();