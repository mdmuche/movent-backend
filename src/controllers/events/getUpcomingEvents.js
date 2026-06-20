import httpStatus from "http-status";

import Event from "../../models/event.js";

import { errorResponse } from "../../utils/response/error.js";
import { successResponse } from "../../utils/response/success.js";
import { paginationUtils } from "../../utils/pagination/pagination.js";

export const getUpcomingEvents = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const query = {
      startDate: { $gte: new Date() },
      approvalStatus: "approved",
    };

    const total = await Event.countDocuments(query);

    const {
      skip,
      limit: limitNum,
      pagination,
    } = paginationUtils({
      page,
      limit,
      total,
    });

    const events = await Event.find(query)
      .sort({ startDate: 1 })
      .skip(skip)
      .limit(limitNum)
      .populate("organizer", "fullName");

    return successResponse(res, {
      statusCode: httpStatus.OK,
      message: "Upcoming events fetched successfully",
      data: {
        events,
        pagination,
      },
    });
  } catch (error) {
    return errorResponse(res, {
      statusCode: httpStatus.INTERNAL_SERVER_ERROR,
      message: "Error fetching upcoming events",
      error: error.message,
    });
  }
};
