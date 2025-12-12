import { aj } from "../config/arcjet.js";

// Arcjet middleware for rate limiting, bot protection, and scurity

export const arcjetMiddleware = async (req, res, next) => {
  try {
    const decision = await aj.protect(req, {
      requested: 1, // each request consumes 1 token
    });

    // Arcjet automatically overrides DRY_RUN denials to ALLOW
    // So we only need to check isDenied() - DRY_RUN rules won't trigger this
    if (decision.isDenied()) {
      if (decision.reason.isRateLimit()) {
        return res.status(429).json({
          error: "Too many requests",
          message: "Rate limit exceeded. Please try again later",
        });
      } else if (decision.reason.isBot()) {
        return res.status(403).json({
          error: "Bot access denied",
          message: "Automated requests are not allowed",
        });
      } else {
        return res.status(403).json({
          error: "Forbidden",
          message: "Access denied by security policy",
        });
      }
    }

    next();
  } catch (error) {
    console.error("Arcjet middleware error:", error);
    // allow request to continue if Arcjet fails
    next();
  }
};
