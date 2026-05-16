import httpStatus from "http-status";
import { successResponse } from "../../utils/response/success.js";
import { errorResponse } from "../../utils/response/error.js";
import TicketCollection from "../../models/ticket.js";

export const getDashboardOverview = async (req, res) => {
  try {
    const userId = req.user.userId;

    // tickets user bought
    const purchasedTickets = await TicketCollection.countDocuments({
      user: userId,
    });

    // upcoming events user is attending
    const upcomingEvents = await TicketCollection.find({
      user: userId,
    }).populate({
      path: "event",
      match: { startDate: { $gte: new Date() } },
    });

    return successResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Dashboard overview fetched successfully",
      data: {
        purchasedTickets,
        upcomingEvents: upcomingEvents.filter((t) => t.event).length,
      },
    });
  } catch (error) {
    return errorResponse(res, {
      statusCode: httpStatus.INTERNAL_SERVER_ERROR,
      message: "Error fetching dashboard overview",
      error: error.message,
    });
  }
};
