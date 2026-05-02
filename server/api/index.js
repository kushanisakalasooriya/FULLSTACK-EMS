import "dotenv/config";
import connectDB from "../config/db.js";
import app from "../app.js";

const missingInngestEnv = [];
if (!process.env.INNGEST_SIGNING_KEY && process.env.INNGEST_DEV !== "1") {
  missingInngestEnv.push("INNGEST_SIGNING_KEY");
}
if (!process.env.INNGEST_EVENT_KEY) {
  missingInngestEnv.push("INNGEST_EVENT_KEY");
}

if (missingInngestEnv.length > 0) {
  console.error(
    `Missing Inngest env vars: ${missingInngestEnv.join(", ")}. ` +
      "Add them in Vercel Project Settings -> Environment Variables.",
  );
}

// In serverless, do not block request handling on DB startup.
// This keeps /api/inngest sync healthy even if Mongo is slow.
connectDB().catch((err) => {
  console.error("Database init failed:", err?.message || err);
});

export default app;
