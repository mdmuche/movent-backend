import httpStatus from "http-status";

import User from "../../models/user.js";

import { successResponse } from "../../utils/response/success.js";
import { errorResponse } from "../../utils/response/error.js";

export const makeOrganizer = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);

    if (!user) {
      return errorResponse(res, {
        statusCode: httpStatus.NOT_FOUND,
        message: "User not found",
      });
    }

    // prevent changing admins
    if (user.role === "admin") {
      return errorResponse(res, {
        statusCode: httpStatus.BAD_REQUEST,
        message: "Cannot modify admin role",
      });
    }

    // already organizer
    if (user.role === "organizer") {
      return errorResponse(res, {
        statusCode: httpStatus.BAD_REQUEST,
        message: "User is already an organizer",
      });
    }

    user.role = "organizer";

    await user.save();

    return successResponse(res, {
      statusCode: httpStatus.OK,
      message: "User promoted to organizer successfully",
      data: {
        userId: user._id,
        role: user.role,
      },
    });
  } catch (error) {
    return errorResponse(res, {
      statusCode: httpStatus.INTERNAL_SERVER_ERROR,
      message: "Error updating user role",
      error: error.message,
    });
  }
};
