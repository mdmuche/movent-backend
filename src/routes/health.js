import express from "express";
import mongoose from "mongoose";
import httpStatus from "http-status";

import packageJson from "../../package.json" with { type: "json" };
import { successResponse } from "../utils/response/success.js";
import { errorResponse } from "../utils/response/error.js";

const router = express.Router();

const version = packageJson.version;

router.get("/health", async (req, res) => {
  try {
    const mongoState = mongoose.connection.readyState;

    const mongoStatus =
      mongoState === 1
        ? "connected"
        : mongoState === 2
          ? "connecting"
          : mongoState === 3
            ? "disconnecting"
            : "disconnected";

    const healthData = {
      status: mongoState === 1 ? "healthy" : "unhealthy",
      timestamp: new Date().toISOString(),
      uptime: Math.floor(process.uptime()), // seconds
      environment: process.env.NODE_ENV || "development",
      database: mongoStatus,
      version: version,
      memory: {
        rss: process.memoryUsage().rss,
        heapUsed: process.memoryUsage().heapUsed,
        heapTotal: process.memoryUsage().heapTotal,
      },
    };

    // Database not connected
    if (mongoState !== 1) {
      return errorResponse(res, {
        statusCode: httpStatus.SERVICE_UNAVAILABLE,
        message: "Service is unhealthy",
        error: healthData,
      });
    }

    return successResponse(res, {
      statusCode: httpStatus.OK,
      message: "Service is healthy",
      data: healthData,
    });
  } catch (error) {
    return errorResponse(res, {
      statusCode: httpStatus.SERVICE_UNAVAILABLE,
      message: "Health check failed",
      error: {
        timestamp: new Date().toISOString(),
        message: error.message,
      },
    });
  }
});

export default router;
