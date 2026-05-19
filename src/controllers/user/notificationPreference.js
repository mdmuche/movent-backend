import httpStatus from "http-status";

import NotificationPreference from "../../models/notificationsPreference.js";

import { successResponse } from "../../utils/response/success.js";
import { errorResponse } from "../../utils/response/error.js";

export const updateNotificationPreferences = async (req, res) => {
  try {
    const userId = req.user.userId;

    const { eventUpdates, promotionalOffers, securityAlerts } = req.body;

    const prefs = await NotificationPreference.findOneAndUpdate(
      { user: userId },
      {
        eventUpdates,
        promotionalOffers,
        securityAlerts,
      },
      { new: true, upsert: true },
    );

    return successResponse(res, {
      statusCode: httpStatus.OK,
      message: "Notification preferences updated successfully",
      data: prefs,
    });
  } catch (error) {
    return errorResponse(res, {
      statusCode: httpStatus.INTERNAL_SERVER_ERROR,
      message: "Error updating preferences",
      error: error.message,
    });
  }
};
