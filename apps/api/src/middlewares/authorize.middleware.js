
/**
 * Require one or more account capabilities.
 *
 * Example:
 * requireCapability("seller")
 * requireCapability("buyer", "seller")
 */
export const requireCapability = (...requiredCapabilities) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }

    const userCapabilities = req.user.capabilities || [];

    const hasRequiredCapability = requiredCapabilities.some(
      (capability) => userCapabilities.includes(capability)
    );

    if (!hasRequiredCapability) {
      return res.status(403).json({
        success: false,
        message: "You do not have permission to perform this operation.",
      });
    }

    next();
  };
};

/**
 * Require verified email ownership.
 */
export const requireVerifiedEmail = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: "Authentication required.",
    });
  }

  if (!req.user.emailVerified) {
    return res.status(403).json({
      success: false,
      message: "Please verify your email before continuing.",
      code: "EMAIL_VERIFICATION_REQUIRED",
    });
  }

  next();
};

/**
 * Require administrative permission.
 */
export const requireAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: "Authentication required.",
    });
  }

  if (req.user.isAdmin !== true) {
    return res.status(403).json({
      success: false,
      message: "Administrative permission required.",
    });
  }

  next();
};
