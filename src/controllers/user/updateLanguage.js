import httpStatus from "http-status";

import User from "../../models/user.js";

import { successResponse } from "../../utils/response/success.js";
import { errorResponse } from "../../utils/response/error.js";

export const updateLanguage = async (req, res) => {
  try {
    const userId = req.user.userId;

    const { language } = req.body;

    const user = await User.findByIdAndUpdate(
      userId,
      { language },
      { new: true },
    ).select("-password");

    return successResponse(res, {
      statusCode: httpStatus.OK,
      message: "Language updated successfully",
      data: user,
    });
  } catch (error) {
    return errorResponse(res, {
      statusCode: httpStatus.INTERNAL_SERVER_ERROR,
      message: "Error updating language",
      error: error.message,
    });
  }
};
