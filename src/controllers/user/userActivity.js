import httpStatus from "http-status";

import UserActivity from "../../models/userActivity.js";

import { successResponse } from "../../utils/response/success.js";
import { errorResponse } from "../../utils/response/error.js";
import { paginationUtils } from "../../utils/pagination/pagination.js";

export const getUserActivity = async (req, res) => {
  try {
    const userId = req.user.userId;

    const { page = 1, limit = 3 } = req.query;

    const total = await UserActivity.countDocuments({
      user: userId,
    });

    // -----------------------------
    // PAGINATION UTILS
    // -----------------------------
    const {
      skip,
      limit: limitNum,
      pagination,
    } = paginationUtils({
      page,
      limit,
      total,
    });

    // -----------------------------
    // FETCH ACTIVITIES (PAGINATED)
    // -----------------------------
    const activities = await UserActivity.find({
      user: userId,
    })
      .populate("event", "title bannerImage startDate")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    const formattedActivities = activities.map((activity) => ({
      id: activity._id,

      type: activity.type,

      message:
        activity.type === "event_saved"
          ? `You saved ${activity.event?.title}`
          : "Activity recorded",

      event: activity.event
        ? {
            id: activity.event._id,
            title: activity.event.title,
            bannerImage: activity.event.bannerImage?.secure_url,
            startDate: activity.event.startDate,
          }
        : null,

      createdAt: activity.createdAt,
    }));

    return successResponse(res, {
      statusCode: httpStatus.OK,
      message: "User activity fetched successfully",
      data: {
        activities: formattedActivities,
        pagination,
      },
    });
  } catch (error) {
    return errorResponse(res, {
      statusCode: httpStatus.INTERNAL_SERVER_ERROR,
      message: "Error fetching user activity",
      error: error.message,
    });
  }
};
