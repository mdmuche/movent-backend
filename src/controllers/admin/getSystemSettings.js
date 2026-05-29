import httpStatus from "http-status";

import { successResponse } from "../../utils/response/success.js";
import { errorResponse } from "../../utils/response/error.js";
import SystemSettings from "../../models/systemSettings.js";

export const getSystemSettings = async (req, res) => {
  try {
    let settings = await SystemSettings.findOne();
    if (!settings) {
      settings = await SystemSettings.create({});
    }
    return successResponse(res, {
      statusCode: httpStatus.OK,
      message: "System settings fetched successfully",
      data: settings,
    });
  } catch (error) {
    return errorResponse(res, {
      statusCode: httpStatus.INTERNAL_SERVER_ERROR,
      message: "Error fetching system settings",
      error: error.message,
    });
  }
};
