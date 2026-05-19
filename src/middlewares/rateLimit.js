import rateLimit from "express-rate-limit";
import httpStatus from "http-status";

import { errorResponse } from "../utils/response/error.js";
export const authLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS, 10),
  max: parseInt(process.env.AUTH_RATE_LIMIT_MAX, 10),

  handler: (req, res) => {
    return errorResponse(res, {
      statusCode: httpStatus.TOO_MANY_REQUESTS,
      message: "Too many login attempts from this IP, please try again later.",
      error: null,
    });
  },
});

export const generalLimiter = rateLimit({
  // radix is 10 to ensure the environment variables are parsed as base-10 integers
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS, 10),
  max: parseInt(process.env.RATE_LIMIT_MAX, 10),
  handler: (req, res) => {
    return errorResponse(res, {
      statusCode: httpStatus.TOO_MANY_REQUESTS,
      message: "Too many requests from this IP, please try again later.",
      error: null,
    });
  },
});
