import jwt from "jsonwebtoken";
import httpStatus from "http-status";

export const verifyToken = (req, res, next) => {
  // 1. Get token from header (Format: Bearer <token>)
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(httpStatus.UNAUTHORIZED).json({
      success: false,
      message: "Access denied. No token provided.",
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    // 2. Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 3. Add user info from payload to the request object
    req.user = decoded;

    next();
  } catch (error) {
    console.error("Token verification failed:", error);
    return res.status(httpStatus.FORBIDDEN).json({
      success: false,
      message: "Invalid or expired token.",
    });
  }
};
