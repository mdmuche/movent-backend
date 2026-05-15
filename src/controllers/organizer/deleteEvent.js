import httpStatus from "http-status";
import Event from "../models/event.model.js";
import { errorResponse } from "../../utils/response/error.js";
import { successResponse } from "../../utils/response/success.js";
import { deleteFromCloudinary } from "../../utils/cloudinary/deleteCloudinary.js";

export const deleteEvent = async (req, res) => {
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

    // delete image
    if (event.bannerImage?.public_id) {
      await deleteFromCloudinary(event.bannerImage.public_id);
    }

    await event.deleteOne();

    return successResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Event deleted successfully",
    });
  } catch (error) {
    return errorResponse(res, {
      statusCode: httpStatus.INTERNAL_SERVER_ERROR,
      message: "Error deleting event",
      error: error.message,
    });
  }
};
