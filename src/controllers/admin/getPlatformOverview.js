import httpStatus from "http-status";
import User from "../../models/user.js";
import Event from "../../models/event.js";
import TicketCollection from "../../models/ticket.js";

import { successResponse } from "../../utils/response/success.js";
import { errorResponse } from "../../utils/response/error.js";

export const getPlatformOverview = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();

    const totalEvents = await Event.countDocuments();

    const pendingEvents = await Event.countDocuments({
      approvalStatus: "pending",
    });

    const tickets = await TicketCollection.find({
      paymentStatus: "paid",
    });

    const totalRevenue = tickets.reduce((acc, ticket) => {
      return acc + (ticket.totalAmount || 0);
    }, 0);

    return successResponse(res, {
      statusCode: httpStatus.OK,
      message: "Platform overview fetched successfully",
      data: {
        totalUsers,
        totalEvents,
        pendingEvents,
        totalRevenue,
        totalTicketsSold: tickets.length,
      },
    });
  } catch (error) {
    return errorResponse(res, {
      statusCode: httpStatus.INTERNAL_SERVER_ERROR,
      message: "Error fetching platform overview",
      error: error.message,
    });
  }
};
