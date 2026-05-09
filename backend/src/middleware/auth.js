import jwt from "jsonwebtoken";

const protect = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // Check if token exists
    if (!authHeader) {
      console.log("❌ No authorization header provided");
      return res.status(401).json({
        message: "No token provided",
      });
    }

    if (!authHeader.startsWith("Bearer ")) {
      console.log("❌ Authorization header doesn't start with 'Bearer '");
      return res.status(401).json({
        message: "Invalid authorization format. Use: Authorization: Bearer <token>",
      });
    }

    // Extract token and remove any whitespace
    const token = authHeader.slice(7).trim();

    if (!token) {
      console.log("❌ Token is empty after extraction");
      return res.status(401).json({
        message: "No token provided",
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("✓ Token verified for user:", decoded.id);

    // Attach user to request
    req.user = decoded;
    next();

  } catch (error) {
    console.error("❌ Auth error:", error.name, "-", error.message);
    
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        message: "Token expired",
        error: "Please login again",
      });
    }
    
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        message: "Invalid token",
        error: error.message,
      });
    }

    return res.status(401).json({
      message: "Invalid or expired token",
      error: error.message,
    });
  }
};

export default protect;