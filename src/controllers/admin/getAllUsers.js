import httpStatus from "http-status";

import User from "../../models/user.js";
import TicketCollection from "../../models/ticket.js";
import Event from "../../models/event.js";

import { successResponse } from "../../utils/response/success.js";
import { errorResponse } from "../../utils/response/error.js";
import { paginationUtils } from "../../utils/pagination/pagination.js";

export const getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    // -----------------------------
    // TOTAL USERS
    // -----------------------------
    const total = await User.countDocuments();

    // -----------------------------
    // PAGINATION UTILS
    // -----------------------------
    const {
      skip,
      limit: limitNum,
      pagination,
    } = paginationUtils({
      page,
      limit,
      total,
    });

    // -----------------------------
    // PAGINATED USERS
    // -----------------------------
    const users = await User.find()
      .select("-password")
      .populate("savedEvents")
      .skip(skip)
      .limit(limitNum)
      .sort({ createdAt: -1 });

    const events = await Event.find();

    const eventMap = new Map();

    // group events by organizer
    events.forEach((event) => {
      const orgId = event.organizer.toString();

      if (!eventMap.has(orgId)) {
        eventMap.set(orgId, []);
      }

      eventMap.get(orgId).push(event._id);
    });

    // -----------------------------
    // ENRICH USERS
    // -----------------------------
    const enrichedUsers = await Promise.all(
      users.map(async (user) => {
        const userId = user._id.toString();

        // PURCHASE COUNT
        const purchaseCount = await TicketCollection.countDocuments({
          user: userId,
        });

        // SALES COUNT (only organizers)
        let salesCount = 0;

        if (user.role === "organizer") {
          const organizerEventIds = eventMap.get(userId) || [];

          salesCount = await TicketCollection.countDocuments({
            event: { $in: organizerEventIds },
            paymentStatus: "paid",
          });
        }

        return {
          ...user._doc,
          purchaseCount,
          salesCount,
        };
      }),
    );

    return successResponse(res, {
      statusCode: httpStatus.OK,
      message: "Users fetched successfully",
      data: {
        users: enrichedUsers,
        pagination,
      },
    });
  } catch (error) {
    return errorResponse(res, {
      statusCode: httpStatus.INTERNAL_SERVER_ERROR,
      message: "Error fetching users",
      error: error.message,
    });
  }
};
