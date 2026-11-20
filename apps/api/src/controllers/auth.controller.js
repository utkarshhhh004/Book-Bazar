
import {
  registerUser,
  loginUser,
  refreshUserSession,
  getCurrentUser,
  logoutUser,
  logoutAllUserSessions,
} from "../services/auth.service.js";

import {
  REFRESH_COOKIE_NAME,
  getRefreshCookieOptions,
} from "../utils/refresh.utils.js";

/**
 * Register a new user.
 * POST /api/v1/auth/register
 */
export const registerController = async (req, res, next) => {
  try {
    const result = await registerUser(req.body);

    return res.status(201).json({
      success: true,
      message: result.verificationEmailSent
        ? "Registration successful. Please verify your email."
        : "Registration successful. Verification email could not be sent. Please request verification again.",
      data: {
        user: result.user,
        verificationEmailSent: result.verificationEmailSent,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Login an existing user.
 * POST /api/v1/auth/login
 */
export const loginController = async (req, res, next) => {
  try {
    const result = await loginUser({
      email: req.body.email,
      password: req.body.password,
      userAgent: req.get("user-agent") || "",
    });

    res.cookie(
      REFRESH_COOKIE_NAME,
      result.refreshToken,
      {
        ...getRefreshCookieOptions(),
        expires: result.refreshTokenExpiresAt,
      }
    );

    return res.status(200).json({
      success: true,
      message: result.user.emailVerified
        ? "Login successful."
        : "Login successful. Please verify your email.",
      data: {
        accessToken: result.accessToken,
        user: result.user,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Refresh the access token.
 * POST /api/v1/auth/refresh
 */
export const refreshController = async (req, res, next) => {
  try {
    const refreshToken = req.cookies?.[REFRESH_COOKIE_NAME];

    const result = await refreshUserSession(refreshToken);

    res.cookie(
      REFRESH_COOKIE_NAME,
      result.refreshToken,
      {
        ...getRefreshCookieOptions(),
        expires: result.refreshTokenExpiresAt,
      }
    );

    return res.status(200).json({
      success: true,
      message: "Session refreshed successfully.",
      data: {
        accessToken: result.accessToken,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Retrieve the authenticated user's profile.
 * GET /api/v1/auth/me
 */
export const currentUserController = async (req, res, next) => {
  try {
    const user = await getCurrentUser(req.user.id);

    return res.status(200).json({
      success: true,
      message: "User profile retrieved successfully.",
      data: { user },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Logout from the current session.
 * POST /api/v1/auth/logout
 */
export const logoutController = async (req, res, next) => {
  try {
    const refreshToken = req.cookies?.[REFRESH_COOKIE_NAME];

    await logoutUser(refreshToken);

    res.clearCookie(
      REFRESH_COOKIE_NAME,
      getRefreshCookieOptions()
    );

    return res.status(200).json({
      success: true,
      message: "Logged out successfully.",
      data: null,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Logout from all active sessions.
 * POST /api/v1/auth/logout-all
 */
export const logoutAllController = async (req, res, next) => {
  try {
    const result = await logoutAllUserSessions(req.user.id);

    res.clearCookie(
      REFRESH_COOKIE_NAME,
      getRefreshCookieOptions()
    );

    return res.status(200).json({
      success: true,
      message: "All sessions have been logged out.",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
