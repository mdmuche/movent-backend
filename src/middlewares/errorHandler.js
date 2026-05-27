import httpStatus from "http-status";

import { errorResponse } from "../utils/response/error.js";

export const errorHandler = (error, req, res, next) => {
  if (res.headersSent) {
    return next(error);
  }

  const statusCode =
    error.statusCode || error.status || httpStatus.INTERNAL_SERVER_ERROR;
  const isServerError = statusCode >= httpStatus.INTERNAL_SERVER_ERROR;

  const logPayload = {
    statusCode,
    message: error.message,
    method: req.method,
    url: req.originalUrl,
    ip: req.ip,
    userId: req.user?.userId,
    stack: error.stack,
  };

  if (isServerError) {
    console.error("Request failed", logPayload);
  } else {
    console.log("Request failed", logPayload);
  }

  return errorResponse(res, {
    statusCode,
    message:
      isServerError && process.env.NODE_ENV === "production"
        ? "Internal server error"
        : error.message || "Something went wrong",
    error:
      process.env.NODE_ENV === "production"
        ? null
        : {
            details: error.details || null,
            stack: error.stack || null,
          },
  });
};
