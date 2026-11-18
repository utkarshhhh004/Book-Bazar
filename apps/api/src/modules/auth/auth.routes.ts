
import { Router } from "express";
import type { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { z } from "zod";

import { prisma } from "../../lib/prisma.js";
import { env } from "../../config/env.js";
import { requireAuth } from "../../middleware/auth.middleware.js";

const router = Router();

const registerSchema = z.object({
  fullName: z.string().trim().min(2).max(100),
  email: z.string().trim().email().transform(
    (value) => value.toLowerCase()
  ),
  password: z.string().min(8).max(72),
});

const loginSchema = z.object({
  email: z.string().trim().email().transform(
    (value) => value.toLowerCase()
  ),
  password: z.string().min(1),
});

function generateToken(userId: string) {
  return jwt.sign(
    { sub: userId },
    env.JWT_SECRET,
    { expiresIn: "7d" }
  );
}

// POST /api/auth/register
router.post(
  "/register",
  async (req: Request, res: Response) => {
    try {
      const parsed = registerSchema.safeParse(req.body);

      if (!parsed.success) {
        return res.status(400).json({
          success: false,
          message: "Invalid registration details",
          errors: parsed.error.flatten(),
        });
      }

      const { fullName, email, password } = parsed.data;

      const existingUser = await prisma.user.findUnique({
        where: { email },
      });

      if (existingUser) {
        return res.status(409).json({
          success: false,
          message: "Email already registered",
        });
      }

      const passwordHash = await bcrypt.hash(password, 12);

      const user = await prisma.user.create({
        data: {
          email,
          passwordHash,
          status: "ACTIVE",
          profile: {
            create: { fullName },
          },
        },
        include: {
          profile: true,
        },
      });

      const token = generateToken(user.id);

      return res.status(201).json({
        success: true,
        message: "Registration successful",
        token,
        user: {
          id: user.id,
          email: user.email,
          fullName: user.profile?.fullName,
          status: user.status,
        },
      });
    } catch (error) {
      console.error("Registration error:", error);

      return res.status(500).json({
        success: false,
        message: "Registration failed",
      });
    }
  }
);

// POST /api/auth/login
router.post(
  "/login",
  async (req: Request, res: Response) => {
    try {
      const parsed = loginSchema.safeParse(req.body);

      if (!parsed.success) {
        return res.status(400).json({
          success: false,
          message: "Invalid login details",
        });
      }

      const { email, password } = parsed.data;

      const user = await prisma.user.findUnique({
        where: { email },
        include: { profile: true },
      });

      if (!user || !user.passwordHash) {
        return res.status(401).json({
          success: false,
          message: "Invalid email or password",
        });
      }

      if (user.status !== "ACTIVE") {
        return res.status(403).json({
          success: false,
          message: "Account is not active",
        });
      }

      const passwordMatches = await bcrypt.compare(
        password,
        user.passwordHash
      );

      if (!passwordMatches) {
        return res.status(401).json({
          success: false,
          message: "Invalid email or password",
        });
      }

      return res.json({
        success: true,
        message: "Login successful",
        token: generateToken(user.id),
        user: {
          id: user.id,
          email: user.email,
          fullName: user.profile?.fullName,
          status: user.status,
        },
      });
    } catch (error) {
      console.error("Login error:", error);

      return res.status(500).json({
        success: false,
        message: "Login failed",
      });
    }
  }
);

// GET /api/auth/me
router.get(
  "/me",
  requireAuth,
  async (req: Request, res: Response) => {
    try {
      const user = await prisma.user.findUnique({
        where: { id: req.authUserId! },
        include: { profile: true },
      });

      if (!user || user.status !== "ACTIVE") {
        return res.status(404).json({
          success: false,
          message: "User not found or inactive",
        });
      }

      return res.json({
        success: true,
        user: {
          id: user.id,
          email: user.email,
          fullName: user.profile?.fullName,
          status: user.status,
        },
      });
    } catch (error) {
      console.error("Profile error:", error);

      return res.status(500).json({
        success: false,
        message: "Unable to fetch profile",
      });
    }
  }
);

// POST /api/auth/logout
router.post(
  "/logout",
  requireAuth,
  (_req: Request, res: Response) => {
    return res.json({
      success: true,
      message: "Logout successful. Discard your access token.",
    });
  }
);

export default router;
