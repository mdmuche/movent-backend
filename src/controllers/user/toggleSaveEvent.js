import httpStatus from "http-status";

import UserActivity from "../../models/userActivity.js";
import User from "../../models/user.js";

import { successResponse } from "../../utils/response/success.js";
import { errorResponse } from "../../utils/response/error.js";

export const toggleSaveEvent = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { eventId } = req.params;

    const user = await User.findById(userId);

    if (!user) {
      return errorResponse(res, {
        statusCode: httpStatus.NOT_FOUND,
        message: "User not found",
      });
    }

    const isSaved = user.savedEvents.some((id) => id.toString() === eventId);

    if (isSaved) {
      // ❌ UNSAVE
      user.savedEvents = user.savedEvents.filter(
        (id) => id.toString() !== eventId,
      );

      await user.save();

      await UserActivity.create({
        user: userId,
        type: "event_unsaved",
        event: eventId,
      });

      return successResponse(res, {
        statusCode: httpStatus.OK,
        message: "Event removed from saved list",
        data: user.savedEvents,
      });
    }

    // ✅ SAVE
    user.savedEvents.push(eventId);
    await user.save();

    await UserActivity.create({
      user: userId,
      type: "event_saved",
      event: eventId,
    });

    return successResponse(res, {
      statusCode: httpStatus.OK,
      message: "Event saved successfully",
      data: user.savedEvents,
    });
  } catch (error) {
    return errorResponse(res, {
      statusCode: httpStatus.INTERNAL_SERVER_ERROR,
      message: "Error toggling saved event",
      error: error.message,
    });
  }
};
