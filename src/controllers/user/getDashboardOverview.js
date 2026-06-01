import httpStatus from "http-status";
import mongoose from "mongoose";

import TicketCollection from "../../models/ticket.js";
import UserActivity from "../../models/userActivity.js";

import { successResponse } from "../../utils/response/success.js";
import { errorResponse } from "../../utils/response/error.js";

export const getDashboardOverview = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.userId);

    // -----------------------------
    // TOTAL PURCHASED TICKETS
    // -----------------------------
    const purchasedTickets = await TicketCollection.countDocuments({
      user: userId,
      paymentStatus: "paid",
    });

    // -----------------------------
    // REVENUE + TICKETS SOLD
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
          ticketsSold: { $sum: "$quantity" },
          netEarnings: { $sum: "$totalAmount" },
        },
      },
    ]);

    const ticketsSold = stats[0]?.ticketsSold || 0;
    const netEarnings = stats[0]?.netEarnings || 0;

    // -----------------------------
    // UPCOMING EVENTS
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

    // -----------------------------
    // ACTIVE EVENTS COUNT
    // -----------------------------
    const activeEventsAgg = await TicketCollection.aggregate([
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
        $count: "total",
      },
    ]);

    const activeEvents = activeEventsAgg[0]?.total || 0;

    // -----------------------------
    // RECENT ACTIVITY
    // -----------------------------
    const recentActivity = await UserActivity.find({
      user: userId,
    })
      .sort({ createdAt: -1 })
      .limit(10);

    // -----------------------------
    // CREDIT BALANCE (placeholder)
    // -----------------------------
    const creditBalance = 0; // later replace with wallet/subscription system

    // -----------------------------
    // RESPONSE
    // -----------------------------
    return successResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Dashboard overview fetched successfully",
      data: {
        creditBalance,
        activeEvents,
        purchasedTickets,
        ticketsSold,
        netEarnings,
        upcomingEvents,
        recentActivity,
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
