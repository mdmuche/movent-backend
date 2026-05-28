import httpStatus from "http-status";

import Event from "../../models/event.js";

import { successResponse } from "../../utils/response/success.js";
import { errorResponse } from "../../utils/response/error.js";
import { paginationUtils } from "../../utils/pagination/pagination.js";

export const getEventQueue = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    // -----------------------------
    // TOTAL PENDING EVENTS
    // -----------------------------
    const total = await Event.countDocuments({
      approvalStatus: "pending",
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
    // FETCH PAGINATED EVENTS
    // -----------------------------
    const events = await Event.find({
      approvalStatus: "pending",
    })
      .populate("organizer", "fullName email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    return successResponse(res, {
      statusCode: httpStatus.OK,
      message: "Event queue fetched successfully",
      data: {
        events,
        pagination,
      },
    });
  } catch (error) {
    return errorResponse(res, {
      statusCode: httpStatus.INTERNAL_SERVER_ERROR,
      message: "Error fetching event queue",
      error: error.message,
    });
  }
};
