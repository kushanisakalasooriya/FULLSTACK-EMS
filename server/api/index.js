import "dotenv/config";
import connectDB from "../config/db.js";
import app from "../app.js";

// In serverless, do not block request handling on DB startup.
// This keeps /api/inngest sync healthy even if Mongo is slow.
connectDB().catch((err) => {
  console.error("Database init failed:", err?.message || err);
});

export default app;
