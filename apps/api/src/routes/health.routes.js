
import { Router } from "express";
import { getDatabaseStatus } from "../database/connect.js";

const router = Router();

router.get("/", (req, res) => {
  const databaseConnected = getDatabaseStatus();

  res.status(databaseConnected ? 200 : 503).json({
    success: databaseConnected,
    message: databaseConnected
      ? "Book Bazar API is healthy"
      : "Database connection unavailable",
    data: {
      api: "running",
      database: databaseConnected ? "connected" : "disconnected"
    }
  });
});

export default router;
