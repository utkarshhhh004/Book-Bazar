
import "./src/config/env.js";
import { verifyEmailConnection } from "./src/services/email.service.js";

try {
  await verifyEmailConnection();
  console.log("GMAIL SMTP CONNECTION SUCCESSFUL");
} catch (error) {
  console.error("GMAIL SMTP CONNECTION FAILED:", error.message);
  process.exitCode = 1;
}
