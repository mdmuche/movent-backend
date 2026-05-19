import httpStatus from "http-status";

import User from "../../models/user.js";
import { deleteFromCloudinary } from "../../utils/cloudinary/deleteCloudinary.js";
import { uploadToCloudinary } from "../../utils/cloudinary/uploadCloudinary.js";

import { successResponse } from "../../utils/response/success.js";
import { errorResponse } from "../../utils/response/error.js";

export const updateProfilePicture = async (req, res) => {
  try {
    const userId = req.user.userId;

    const user = await User.findById(userId);

    if (!user) {
      return errorResponse(res, {
        statusCode: httpStatus.NOT_FOUND,
        message: "User not found",
      });
    }

    // -----------------------------
    // delete old image
    // -----------------------------
    if (user.profilePicturePublicId) {
      await deleteFromCloudinary(user.profilePicturePublicId);
    }

    // -----------------------------
    // upload new image
    // -----------------------------
    if (!req.file) {
      return errorResponse(res, {
        statusCode: httpStatus.BAD_REQUEST,
        message: "No image uploaded",
      });
    }

    const result = await uploadToCloudinary(req.file.path, {
      folder: "movent/profile-pictures",
    });

    // -----------------------------
    // update user
    // -----------------------------
    user.profilePicture = result.url;
    user.profilePicturePublicId = result.public_id;

    await user.save();

    return successResponse(res, {
      statusCode: httpStatus.OK,
      message: "Profile picture updated successfully",
      data: {
        profilePicture: user.profilePicture,
      },
    });
  } catch (error) {
    return errorResponse(res, {
      statusCode: httpStatus.INTERNAL_SERVER_ERROR,
      message: "Error updating profile picture",
      error: error.message,
    });
  }
};
