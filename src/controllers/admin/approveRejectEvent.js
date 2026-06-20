import httpStatus from "http-status";

import Event from "../../models/event.js";
import AuditLog from "../../models/auditLog.js";
import { successResponse } from "../../utils/response/success.js";
import { errorResponse } from "../../utils/response/error.js";
import { sendNotification } from "../../services/notification.js";

export const approveRejectEvent = async (req, res) => {
  try {
    const { eventId } = req.params;
    const { action, reason } = req.body;
    const adminId = req.user.userId;

    const event = await Event.findById(eventId);

    if (!event) {
      return errorResponse(res, {
        statusCode: httpStatus.NOT_FOUND,
        message: "Event not found",
      });
    }

    if (
      (event.approvalStatus === "approved" && action === "approve") ||
      (event.approvalStatus === "rejected" && action === "reject")
    ) {
      return errorResponse(res, {
        statusCode: httpStatus.BAD_REQUEST,
        message: `Event has already been ${event.approvalStatus}`,
      });
    }

    if (action === "approve") {
      event.approvalStatus = "approved";
      event.status = "active";
    } else if (action === "reject") {
      event.approvalStatus = "rejected";
      event.status = "draft";
    }

    await event.save();

    // ---------------------------------
    // LOG ACTION IN AUDIT SYSTEM
    // ---------------------------------
    await AuditLog.create({
      action: action === "approve" ? "event_approved" : "event_rejected",
      performedBy: adminId,
      targetType: "event",
      targetId: event._id,
      metadata: {
        reason: action === "reject" ? reason : undefined,
      },
    });

    // ---------------------------------
    // DISPATCH NOTIFICATION TO ORGANIZER
    // ---------------------------------
    await sendNotification({
      user: event.organizer,
      title: action === "approve" ? "Event Approved 🎉" : "Event Rejected ❌",
      message:
        action === "approve"
          ? `Your event "${event.title}" has been approved and is now active.`
          : `Your event "${event.title}" was rejected. Reason: ${reason || "No reason specified"}`,
      type: "event",
      metadata: { eventId: event._id },
    });

    return successResponse(res, {
      statusCode: httpStatus.OK,
      message: `Event has been successfully ${action}d`,
      data: event,
    });
  } catch (error) {
    return errorResponse(res, {
      statusCode: httpStatus.INTERNAL_SERVER_ERROR,
      message: "Error processing event approval/rejection",
      error: error.message,
    });
  }
};
