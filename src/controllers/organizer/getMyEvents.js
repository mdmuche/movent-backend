import httpStatus from "http-status";
import Event from "../models/event.model.js";
import { errorResponse } from "../../utils/response/error.js";
import { successResponse } from "../../utils/response/success.js";

export const getMyEvents = async (req, res) => {
  try {
    const userId = req.user.userId;

    const events = await Event.find({
      organizer: userId,
    }).sort({ createdAt: -1 });

    return successResponse(res, {
      statusCode: httpStatus.OK,
      message: "Organizer events fetched successfully",
      data: events,
    });
  } catch (error) {
    return errorResponse(res, {
      statusCode: httpStatus.INTERNAL_SERVER_ERROR,
      message: "Error fetching events",
      error: error.message,
    });
  }
};
