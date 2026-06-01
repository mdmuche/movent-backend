import httpStatus from "http-status";

import User from "../../models/user.js";
import { successResponse } from "../../utils/response/success.js";
import { errorResponse } from "../../utils/response/error.js";

export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.userId;

    const { fullName, email, bio } = req.body;

    const user = await User.findByIdAndUpdate(
      userId,
      {
        fullName,
        email,
        bio,
      },
      { returnDocument: "after" },
    ).select("-password");

    return successResponse(res, {
      statusCode: httpStatus.OK,
      message: "Profile updated successfully",
      data: user,
    });
  } catch (error) {
    return errorResponse(res, {
      statusCode: httpStatus.INTERNAL_SERVER_ERROR,
      message: "Error updating profile",
      error: error.message,
    });
  }
};
