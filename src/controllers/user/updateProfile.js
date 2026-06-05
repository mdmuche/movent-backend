import httpStatus from "http-status";
import User from "../../models/user.js";
import { successResponse } from "../../utils/response/success.js";
import { errorResponse } from "../../utils/response/error.js";

export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { fullName, email, bio } = req.body;

    const user = await User.findById(userId).select("-password");

    if (!user) {
      return errorResponse(res, {
        statusCode: httpStatus.NOT_FOUND,
        message: "User not found",
      });
    }

    // -----------------------------
    // NORMALIZE EMAIL ONCE
    // -----------------------------
    const normalizedEmail = email?.trim().toLowerCase();
    const currentEmail = user.email?.trim().toLowerCase();

    // -----------------------------
    // CHECK IF ANYTHING CHANGED (FIXED)
    // -----------------------------
    const isSame =
      (fullName ?? user.fullName) === user.fullName &&
      (normalizedEmail ?? currentEmail) === currentEmail &&
      (bio ?? user.bio) === user.bio;

    if (isSame) {
      return successResponse(res, {
        statusCode: httpStatus.OK,
        message: "No changes detected",
        data: user,
      });
    }

    // -----------------------------
    // EMAIL CHECK
    // -----------------------------
    if (normalizedEmail && normalizedEmail !== currentEmail) {
      const exists = await User.findOne({
        email: normalizedEmail,
        _id: { $ne: userId },
      });

      if (exists) {
        return errorResponse(res, {
          statusCode: httpStatus.CONFLICT,
          message: "Email already in use",
        });
      }
    }

    // -----------------------------
    // BUILD UPDATE DATA (FIXED)
    // -----------------------------
    const updateData = {};

    if (fullName !== undefined && fullName !== user.fullName) {
      updateData.fullName = fullName;
    }

    if (normalizedEmail && normalizedEmail !== currentEmail) {
      updateData.email = normalizedEmail; // ✅ IMPORTANT FIX
    }

    if (bio !== undefined && bio !== user.bio) {
      updateData.bio = bio;
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updateData },
      { new: true, runValidators: true },
    ).select("-password");

    return successResponse(res, {
      statusCode: httpStatus.OK,
      message: "Profile updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    return errorResponse(res, {
      statusCode: httpStatus.INTERNAL_SERVER_ERROR,
      message: "Error updating profile",
      error: error.message,
    });
  }
};
