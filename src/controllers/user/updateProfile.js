import httpStatus from "http-status";
import User from "../../models/user.js";
import { successResponse } from "../../utils/response/success.js";
import { errorResponse } from "../../utils/response/error.js";

export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.userId;

    const { fullName, email, bio } = req.body;

    if (email) {
      const exists = await User.findOne({ email });
      if (exists && exists._id.toString() !== userId) {
        return errorResponse(res, {
          statusCode: httpStatus.CONFLICT,
          message: "Email already in use",
        });
      }
    }

    // Build update object safely (prevents undefined overwrite)
    const updateData = {};

    if (fullName !== undefined) updateData.fullName = fullName;
    if (email !== undefined) updateData.email = email;
    if (bio !== undefined) updateData.bio = bio;

    const user = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
      runValidators: true, // IMPORTANT
    }).select("-password");

    if (!user) {
      return errorResponse(res, {
        statusCode: httpStatus.NOT_FOUND,
        message: "User not found",
      });
    }

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
