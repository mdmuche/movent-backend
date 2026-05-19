import httpStatus from "http-status";

import UserActivity from "../../models/userActivity.js";
import User from "../../models/user.js";

import { successResponse } from "../../utils/response/success.js";
import { errorResponse } from "../../utils/response/error.js";

export const saveEvent = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { eventId } = req.params;

    const user = await User.findById(userId);

    // prevent duplicates
    if (user.savedEvents.includes(eventId)) {
      return errorResponse(res, {
        statusCode: httpStatus.BAD_REQUEST,
        message: "Event already saved",
      });
    }

    user.savedEvents.push(eventId);

    await user.save();

    // CREATE ACTIVITY ✅
    await UserActivity.create({
      user: userId,
      type: "event_saved",
      event: eventId,
    });

    return successResponse(res, {
      statusCode: httpStatus.OK,
      message: "Event saved successfully",
    });
  } catch (error) {
    return errorResponse(res, {
      statusCode: httpStatus.INTERNAL_SERVER_ERROR,
      message: "Error saving event",
      error: error.message,
    });
  }
};
