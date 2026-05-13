import rateLimit from "express-rate-limit";
import dotenv from "dotenv";

dotenv.config();

export const authLimiter = rateLimit({
  // radix is 10 to ensure the environment variables are parsed as base-10 integers
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS, 10),
  max: parseInt(process.env.AUTH_RATE_LIMIT_MAX, 10),
});

export const generalLimiter = rateLimit({
  // radix is 10 to ensure the environment variables are parsed as base-10 integers
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS, 10),
  max: parseInt(process.env.RATE_LIMIT_MAX, 10),
});
