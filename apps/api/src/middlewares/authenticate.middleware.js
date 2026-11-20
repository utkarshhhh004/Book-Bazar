
import User from "../models/User.js";
import { verifyAccessToken } from "../utils/jwt.utils.js";

/**
 * Verify JWT access token and authenticate the user.
 */
export const authenticate = async (req, res, next) => {
  try {
    const authorization = req.headers.authorization;

    if (!authorization || !authorization.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }

    const accessToken = authorization.slice(7).trim();

    if (!accessToken) {
      return res.status(401).json({
        success: false,
        message: "Access token is missing.",
      });
    }

    const decoded = verifyAccessToken(accessToken);

    const user = await User.findById(decoded.sub)
      .select("+isAdmin");

    if (!user || user.accountStatus !== "active") {
      return res.status(401).json({
        success: false,
        message: "User account is unavailable.",
      });
    }

    // Attach authenticated identity to the request.
    req.user = {
      id: user._id.toString(),
      fullName: user.fullName,
      email: user.email,
      emailVerified: user.emailVerified,
      capabilities: user.capabilities,
      isAdmin: user.isAdmin,
      accountStatus: user.accountStatus,
    };

    next();
  } catch (error) {
    if (
      error.name === "JsonWebTokenError" ||
      error.name === "TokenExpiredError"
    ) {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired access token.",
      });
    }

    next(error);
  }
};
