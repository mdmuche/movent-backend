import httpStatus from "http-status";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

import { errorResponse } from "../../utils/response/error.js";
import { successResponse } from "../../utils/response/success.js";
import User from "../../models/user.js";
import TokenCollection from "../../models/token.js";

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return errorResponse(res, {
        statusCode: httpStatus.UNAUTHORIZED,
        message: "Invalid credentials",
      });
    }
    // 2. check if user is verified
    if (!user.isEmailVerified) {
      return errorResponse(res, {
        statusCode: httpStatus.FORBIDDEN,
        message: "Please verify your email before logging in.",
      });
    }

    // 3. Compare Password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return errorResponse(res, {
        statusCode: httpStatus.UNAUTHORIZED,
        message: "Invalid credentials",
      });
    }

    // 4. Generate JWT Token
    const accessToken = jwt.sign(
      {
        userId: user._id,
        role: user.role,
        fullName: user.fullName,
        email: user.email,
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN },
    );

    // Generate Refresh Token (optional, but recommended for better security)
    const refreshToken = jwt.sign(
      {
        userId: user._id,
      },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN },
    );
    // SAVE TOKEN IN DB
    await TokenCollection.create({
      user: user._id,
      refreshToken,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    // SEND ACCESSTOKEN COOKIE TO CLIENT
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "none",
      maxAge: 24 * 60 * 60 * 1000,
    });

    // SEND REFRESHTOKEN COOKIE TO CLIENT
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    // 5. Send Response
    return successResponse(res, {
      statusCode: httpStatus.OK,
      message: "Login successful",
      data: {
        userId: user._id,
        fullName: user.fullName,
        email: user.email,
        profilePicture: user.profilePicture,
        role: user.role,
      },
    });
  } catch (error) {
    return errorResponse(res, {
      statusCode: httpStatus.INTERNAL_SERVER_ERROR,
      message: "An error occurred during login",
      error: error.message,
    });
  }
};
