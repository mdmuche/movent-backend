import httpStatus from "http-status";
import mongoose from "mongoose";

import Event from "../../models/event.js";
import TicketCollection from "../../models/ticket.js";

import { successResponse } from "../../utils/response/success.js";
import { errorResponse } from "../../utils/response/error.js";

export const getOrganizerDashboardOverview = async (req, res) => {
  try {
    const organizerId = new mongoose.Types.ObjectId(req.user.userId);

    // -----------------------------
    // GET ORGANIZER EVENTS
    // -----------------------------
    const events = await Event.find(
      { organizer: organizerId },
      "_id startDate endDate",
    );

    const eventIds = events.map((e) => e._id);

    // -----------------------------
    // UPCOMING EVENTS (ORGANIZER CREATED)
    // -----------------------------
    const myEvents = await Event.find({
      organizer: organizerId,
      startDate: { $gte: new Date() },
    })
      .sort({ startDate: 1 })
      .limit(5);

    // -----------------------------
    // ACTIVE EVENTS
    // -----------------------------
    const activeEvents = await Event.countDocuments({
      organizer: organizerId,
      startDate: { $lte: new Date() },
      endDate: { $gte: new Date() },
    });

    // -----------------------------
    // TICKETS + REVENUE
    // -----------------------------
    const stats = await TicketCollection.aggregate([
      {
        $match: {
          event: { $in: eventIds },
          paymentStatus: "paid",
        },
      },
      {
        $group: {
          _id: null,
          ticketsSold: { $sum: "$quantity" },
          revenue: { $sum: "$totalAmount" },
        },
      },
    ]);

    const ticketsSold = stats[0]?.ticketsSold || 0;
    const revenue = stats[0]?.revenue || 0;

    // -----------------------------
    // CREDIT BALANCE (wallet later)
    // -----------------------------
    const creditBalance = 0;

    return successResponse(res, {
      statusCode: httpStatus.OK,
      message: "Organizer dashboard fetched successfully",
      data: {
        creditBalance,
        activeEvents,
        myEvents,
        ticketsSold,
        revenue,
      },
    });
  } catch (error) {
    return errorResponse(res, {
      statusCode: httpStatus.INTERNAL_SERVER_ERROR,
      message: "Error fetching organizer dashboard",
      error: error.message,
    });
  }
};
