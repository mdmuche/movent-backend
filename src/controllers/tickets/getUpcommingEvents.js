import httpStatus from "http-status";
import TicketCollection from "../../models/ticket";
import { errorResponse } from "../../utils/response/error";
import { successResponse } from "../../utils/response/success";

export const getUpcomingEvents = async (req, res) => {
  try {
    const userId = req.user.userId;

    const tickets = await TicketCollection.find({
      user: userId,
    }).populate({
      path: "event",
      match: { startDate: { $gte: new Date() } },
    });

    const upcomingEvents = tickets.map((t) => t.event).filter(Boolean);

    return successResponse(res, {
      statusCode: httpStatus.OK,
      message: "Upcoming events fetched successfully",
      data: upcomingEvents,
    });
  } catch (error) {
    return errorResponse(res, {
      statusCode: httpStatus.INTERNAL_SERVER_ERROR,
      message: "Error fetching upcoming events",
      error: error.message,
    });
  }
};
