import httpStatus from "http-status";

import User from "../../models/user.js";
import TicketCollection from "../../models/ticket.js";
import Event from "../../models/event.js";
import UserActivity from "../../models/userActivity.js";

import { successResponse } from "../../utils/response/success.js";
import { errorResponse } from "../../utils/response/error.js";
import NotificationPreference from "../../models/notificationsPreference.js";

export const getProfile = async (req, res) => {
  try {
    const userId = req.user.userId;

    // -----------------------------
    // USER BASIC INFO
    // -----------------------------
    const user = await User.findById(userId).select("-password");

    if (!user) {
      return errorResponse(res, {
        statusCode: httpStatus.NOT_FOUND,
        message: "User not found",
      });
    }

    // -----------------------------
    // NOTIFICATION PREFERENCES
    // -----------------------------
    const notificationPreferences = await NotificationPreference.findOne({
      user: userId,
    });

    // -----------------------------
    // STATS
    // -----------------------------

    const ticketsPurchased = await TicketCollection.countDocuments({
      user: userId,
    });

    const eventsCreated = await Event.countDocuments({
      organizer: userId,
    });

    const savedEventsCount = user.savedEvents?.length || 0;

    // -----------------------------
    // ACTIVITY SUMMARY
    // -----------------------------

    const recentActions = await UserActivity.find({
      user: userId,
    })
      .sort({ createdAt: -1 })
      .limit(10)
      .populate("event", "title bannerImage startDate");

    const lastLogin = user.lastLoginAt || null;

    // -----------------------------
    // RESPONSE
    // -----------------------------
    return successResponse(res, {
      statusCode: httpStatus.OK,
      message: "User profile fetched successfully",
      data: {
        user,
        notificationPreferences,
        stats: {
          ticketsPurchased,
          eventsCreated,
          savedEventsCount,
        },
        activity: {
          lastLogin,
          recentActions,
        },
      },
    });
  } catch (error) {
    return errorResponse(res, {
      statusCode: httpStatus.INTERNAL_SERVER_ERROR,
      message: "Error fetching user profile",
      error: error.message,
    });
  }
};
