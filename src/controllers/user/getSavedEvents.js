import httpStatus from "http-status";
import { errorResponse } from "../../utils/response/error.js";
import { successResponse } from "../../utils/response/success.js";
import User from "../../models/user.js";

export const getSavedEvents = async (req, res) => {
  try {
    const userId = req.user.userId;

    const user = await User.findById(userId).populate("savedEvents");

    return successResponse(res, {
      statusCode: httpStatus.OK,
      message: "Saved events fetched successfully",
      data: user.savedEvents,
    });
  } catch (error) {
    return errorResponse(res, {
      statusCode: httpStatus.INTERNAL_SERVER_ERROR,
      message: "Error fetching saved events",
      error: error.message,
    });
  }
};
