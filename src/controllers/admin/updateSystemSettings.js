import httpStatus from "http-status";

import SystemSettings from "../../models/systemSettings.js";
import AuditLog from "../../models/auditLog.js";

import { successResponse } from "../../utils/response/success.js";
import { errorResponse } from "../../utils/response/error.js";

export const updateSystemSettings = async (req, res) => {
  try {
    const {
      platformCommission,
      maxTicketPerPurchase,
      maintenanceMode,
      supportEmail,
    } = req.body;
    console.log(req.body);
    const settings = await SystemSettings.findOneAndUpdate(
      {},
      {
        platformCommission,
        maxTicketPerPurchase,
        maintenanceMode,
        supportEmail,
      },
      {
        new: true,
        upsert: true,
        runValidators: true,
      },
    );

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
      message: "Error updating system settings",
      error: error.message,
    });
  }
};
