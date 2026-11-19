
import express from "express";

import authRoutes from "./modules/auth/auth.routes.js";
import usersRoutes from "./users/users.routes.js";
import { env } from "./config/env.js";

const app = express();

import cors from "cors";

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

app.get("/", (_req, res) => {
  res.json({
    success: true,
    message: "Welcome to Book Bazar API",
    version: "1.0.0",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/users", usersRoutes);

app.use((_req, res) => {
  res.status(404).json({
    success: false,
    error: {
      code: "NOT_FOUND",
      message: "Route not found",
    },
  });
});

app.listen(env.PORT, () => {
  console.log(
    `BOOK BAZAR API listening on http://localhost:${env.PORT}`
  );
});
