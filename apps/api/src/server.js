import "./config/env.js";
import app from "./app.js";
import { env } from "./config/env.js";
import { connectDatabase } from "./database/connect.js";

let server;

const startServer = async () => {
  try {
    await connectDatabase();

    server = app.listen(env.PORT, () => {
      console.log(`Book Bazar API running at http://localhost:${env.PORT}`);
      console.log(`Environment: ${env.NODE_ENV}`);
    });
  } catch (error) {
    console.error("Server startup failed:", error.message);
    process.exit(1);
  }
};

const shutdown = async (signal) => {
  console.log(`${signal} received. Shutting down...`);

  if (server) {
    server.close(async () => {
      const mongoose = await import("mongoose");
      await mongoose.default.disconnect();

      console.log("Server and database disconnected.");
      process.exit(0);
    });
  } else {
    process.exit(0);
  }
};

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));

startServer();
