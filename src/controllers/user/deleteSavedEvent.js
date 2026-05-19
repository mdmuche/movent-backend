import httpStatus from "http-status";

import { successResponse } from "../../utils/response/success.js";
import { errorResponse } from "../../utils/response/error.js";
import User from "../../models/user.js";
import UserActivity from "../../models/userActivity.js";

export const deleteSavedEvent = async (req, res) => {
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

    // check if event is actually saved
    const isSaved = user.savedEvents.includes(eventId);

    if (!isSaved) {
      return errorResponse(res, {
        statusCode: httpStatus.BAD_REQUEST,
        message: "Event is not in saved list",
      });
    }

    // remove event from saved list
    user.savedEvents = user.savedEvents.filter(
      (id) => id.toString() !== eventId,
    );

    await user.save();

    // optional: log activity
    await UserActivity.create({
      user: userId,
      type: "event_unsaved",
      event: eventId,
    });

    return successResponse(res, {
      statusCode: httpStatus.OK,
      message: "Event removed from saved list",
    });
  } catch (error) {
    return errorResponse(res, {
      statusCode: httpStatus.INTERNAL_SERVER_ERROR,
      message: "Error removing saved event",
      error: error.message,
    });
  }
};
