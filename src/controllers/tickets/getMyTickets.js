import httpStatus from "http-status";
import TicketCollection from "../../models/ticket";
import { errorResponse } from "../../utils/response/error";
import { successResponse } from "../../utils/response/success";

export const getMyTickets = async (req, res) => {
  try {
    const userId = req.user.userId;

    const tickets = await TicketCollection.find({
      user: userId,
    })
      .populate("event")
      .sort({ createdAt: -1 });

    return successResponse(res, {
      statusCode: httpStatus.OK,
      message: "Tickets fetched successfully",
      data: tickets,
    });
  } catch (error) {
    return errorResponse(res, {
      statusCode: httpStatus.INTERNAL_SERVER_ERROR,
      message: "Error fetching tickets",
      error: error.message,
    });
  }
};
