import httpStatus from "http-status";
import slugify from "slugify";
import { errorResponse } from "../../utils/response/error.js";
import { successResponse } from "../../utils/response/success.js";
import { uploadToCloudinary } from "../../utils/cloudinary/uploadCloudinary.js";
import { deleteFromCloudinary } from "../../utils/cloudinary/deleteCloudinary.js";
import Event from "../../models/event.js";
import AuditLog from "../../models/auditLog.js";

export const updateEvent = async (req, res) => {
  try {
    const { id } = req.params;

    const event = await Event.findById(id);

    if (!event) {
      return errorResponse(res, {
        statusCode: httpStatus.NOT_FOUND,
        message: "Event not found",
      });
    }

    // owner/admin check
    if (
      event.organizer.toString() !== req.userDetails.id &&
      req.userDetails.role !== "admin"
    ) {
      return errorResponse(res, {
        statusCode: httpStatus.FORBIDDEN,
        message: "Unauthorized",
      });
    }

    let bannerImage = event.bannerImage;

    // replace image
    if (req.file) {
      if (event.bannerImage?.public_id) {
        await deleteFromCloudinary(event.bannerImage.public_id);
      }

      const uploadedImage = await uploadToCloudinary(req.file.path, {
        folder: "movent/events",
      });

      bannerImage = {
        public_id: uploadedImage.public_id,
        url: uploadedImage.secure_url,
      };
    }

    const updatedData = {
      ...req.body,
      bannerImage,
    };

    // regenerate slug if title changes
    if (req.body.title) {
      updatedData.slug = slugify(req.body.title, {
        lower: true,
        strict: true,
      });
    }

    const updatedEvent = await Event.findByIdAndUpdate(id, updatedData, {
      new: true,
    });

    await AuditLog.create({
      action: "event_updated",
      performedBy: req.user.userId,
      targetType: "event",
      targetId: event._id,
    });

    return successResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Event updated successfully",
      data: updatedEvent,
    });
  } catch (error) {
    return errorResponse(res, {
      statusCode: httpStatus.INTERNAL_SERVER_ERROR,
      message: "Error updating event",
      error: error.message,
    });
  }
};
