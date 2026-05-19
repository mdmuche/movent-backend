import httpStatus from "http-status";

import { successResponse } from "../../utils/response/success.js";
import { errorResponse } from "../../utils/response/error.js";
import SystemSettings from "../../models/systemSettings.js";
import AuditLog from "../../models/auditLog.js";

export const updateSystemSettings = async (req, res) => {
  try {
    const settings = await SystemSettings.findOneAndUpdate({}, req.body, {
      new: true,
      upsert: true,
    });

    await AuditLog.create({
      action: "settings_updated",
      performedBy: req.user.userId,
      targetType: "settings",
      targetId: settings._id,
    });

    return successResponse(res, {
      statusCode: httpStatus.OK,
      message: "System settings updated successfully",
      data: settings,
    });
  } catch (error) {
    return errorResponse(res, {
      statusCode: httpStatus.INTERNAL_SERVER_ERROR,
      message: "Error updating settings",
      error: error.message,
    });
  }
};
