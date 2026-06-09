import httpStatus from "http-status";
import mongoose from "mongoose";

import TicketCollection from "../../models/ticket.js";

import { successResponse } from "../../utils/response/success.js";
import { errorResponse } from "../../utils/response/error.js";

export const getUserDashboardOverview = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.userId);

    // -----------------------------
    // PURCHASED TICKETS
    // -----------------------------
    const purchasedTickets = await TicketCollection.countDocuments({
      user: userId,
      paymentStatus: "paid",
    });

    // -----------------------------
    // SPENT + TICKETS
    // -----------------------------
    const stats = await TicketCollection.aggregate([
      {
        $match: {
          user: userId,
          paymentStatus: "paid",
        },
      },
      {
        $group: {
          _id: null,
          ticketsBought: { $sum: "$quantity" },
          totalSpent: { $sum: "$totalAmount" },
        },
      },
    ]);

    const ticketsBought = stats[0]?.ticketsBought || 0;
    const totalSpent = stats[0]?.totalSpent || 0;

    // -----------------------------
    // UPCOMING EVENTS (USER ATTENDING)
    // -----------------------------
    const upcomingEvents = await TicketCollection.aggregate([
      { $match: { user: userId } },
      {
        $lookup: {
          from: "events",
          localField: "event",
          foreignField: "_id",
          as: "event",
        },
      },
      { $unwind: "$event" },
      {
        $match: {
          "event.startDate": { $gte: new Date() },
        },
      },
      {
        $sort: { "event.startDate": 1 },
      },
      {
        $limit: 5,
      },
      {
        $replaceRoot: { newRoot: "$event" },
      },
    ]);

    return successResponse(res, {
      statusCode: httpStatus.OK,
      message: "User dashboard fetched successfully",
      data: {
        purchasedTickets,
        ticketsBought,
        totalSpent,
        upcomingEvents,
      },
    });
  } catch (error) {
    return errorResponse(res, {
      statusCode: httpStatus.INTERNAL_SERVER_ERROR,
      message: "Error fetching user dashboard",
      error: error.message,
    });
  }
};
