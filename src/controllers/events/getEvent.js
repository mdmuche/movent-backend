import httpStatus from "http-status";
import Event from "../../models/event.js";
import { errorResponse } from "../../utils/response/error.js";
import { successResponse } from "../../utils/response/success.js";

export const getEvent = async (req, res) => {
  try {
    const { slug } = req.params;

    const event = await Event.findOne({ slug }).populate(
      "organizer",
      "fullName email",
    );

    if (!event) {
      return errorResponse(res, {
        statusCode: httpStatus.NOT_FOUND,
        message: "Event not found",
      });
    }

    return successResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Event fetched successfully",
      data: event,
    });
  } catch (error) {
    return errorResponse(res, {
      statusCode: httpStatus.INTERNAL_SERVER_ERROR,
      message: "Error fetching event",
      error: error.message,
    });
  }
};
