import rateLimit from "express-rate-limit";
import httpStatus from "http-status";

import { errorResponse } from "../utils/response/error.js";
import { getEnvNumber } from "../utils/env.js";

export const authLimiter = rateLimit({
  windowMs: getEnvNumber("RATE_LIMIT_WINDOW_MS", 15 * 60 * 1000),
  max: getEnvNumber("AUTH_RATE_LIMIT_MAX", 10),

  handler: (req, res) => {
    return errorResponse(res, {
      statusCode: httpStatus.TOO_MANY_REQUESTS,
      message: "Too many login attempts from this IP, please try again later.",
      error: null,
    });
  },
});

export const generalLimiter = rateLimit({
  windowMs: getEnvNumber("RATE_LIMIT_WINDOW_MS", 15 * 60 * 1000),
  max: getEnvNumber("RATE_LIMIT_MAX", 100),
  handler: (req, res) => {
    return errorResponse(res, {
      statusCode: httpStatus.TOO_MANY_REQUESTS,
      message: "Too many requests from this IP, please try again later.",
      error: null,
    });
  },
});
