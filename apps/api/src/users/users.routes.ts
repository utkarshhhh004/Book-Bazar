
import { Router } from "express";
import type { Request, Response } from "express";
import { z } from "zod";

import { prisma } from "../lib/prisma.js";
import { requireAuth } from "../middleware/auth.middleware.js";

const router = Router();

const updateProfileSchema = z.object({
  fullName: z.string().trim().min(2).max(100),
});

// GET /api/users/profile
router.get(
  "/profile",
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
          message: "User not found",
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

// PATCH /api/users/profile
router.patch(
  "/profile",
  requireAuth,
  async (req: Request, res: Response) => {
    try {
      const parsed = updateProfileSchema.safeParse(req.body);

      if (!parsed.success) {
        return res.status(400).json({
          success: false,
          message: "Invalid profile details",
          errors: parsed.error.flatten(),
        });
      }

      const user = await prisma.user.findUnique({
        where: { id: req.authUserId! },
      });

      if (!user || user.status !== "ACTIVE") {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      const profile = await prisma.userProfile.upsert({
        where: { userId: user.id },
        update: {
          fullName: parsed.data.fullName,
        },
        create: {
          userId: user.id,
          fullName: parsed.data.fullName,
        },
      });

      return res.json({
        success: true,
        message: "Profile updated successfully",
        profile: {
          fullName: profile.fullName,
        },
      });
    } catch (error) {
      console.error("Update profile error:", error);

      return res.status(500).json({
        success: false,
        message: "Unable to update profile",
      });
    }
  }
);

export default router;
