import mongoose from "mongoose";
import dns from "node:dns";

const clientOptions = {
  serverApi: { version: "1", strict: true, deprecationErrors: true },
};

const PUBLIC_DNS = ["8.8.8.8", "1.1.1.1"];

function isSrvLookupFailure(err) {
  const msg = String(err?.message ?? err);
  return msg.includes("querySrv") || msg.includes("_mongodb._tcp");
}

const connectDB = async () => {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error("Missing MONGODB_URI. Add it to server/.env (see Atlas → Connect → Drivers).");
    return;
  }
  if (uri.includes("<db_password>")) {
    console.error("Replace <db_password> in MONGODB_URI with your database user password.");
    return;
  }

  mongoose.connection.on("connected", () => {
    console.log("Connected to MongoDB");
  });

  const attempt = async () => {
    await mongoose.connect(uri, clientOptions);
    await mongoose.connection.db.admin().command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  };

  try {
    await attempt();
  } catch (error) {
    if (!isSrvLookupFailure(error)) {
      console.error("Error connecting to MongoDB:", error.message);
      return;
    }

    console.warn(
      "MongoDB SRV DNS lookup failed. Retrying with public DNS (8.8.8.8, 1.1.1.1)..."
    );
    dns.setServers(PUBLIC_DNS);

    try {
      await mongoose.disconnect().catch(() => {});
      await attempt();
    } catch (retryErr) {
      console.error("Error connecting to MongoDB:", retryErr.message);
      console.error(
        "Still failing: use Atlas → Connect → \"Drivers\" → choose connection type that shows a Standard (mongodb://) URI (not mongodb+srv), paste it as MONGODB_URI. Or fix VPN/firewall so DNS to Atlas SRV records works."
      );
    }
  }
};

export default connectDB;
