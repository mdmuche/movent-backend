import httpStatus from "http-status";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { v4 } from "uuid";

import User from "../models/users.model.js";
import { sendEmail } from "../utils/email.util.js";
import TokenCollection from "../models/token.model.js";

//controller for user registration
export const register = async (req, res) => {
  try {
    //1. Get user input
    const { fullName, email, location, password } = req.body;

    //2. Check if the user already exists in the database
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(httpStatus.CONFLICT).json({
        statusCode: httpStatus.CONFLICT,
        success: false,
        message: "User already exists with this email",
      });
    }

    const verificationToken = v4();

    //4. Create a new user
    const user = await User.create({
      fullName,
      email,
      password: password,
      location,
      authToken: verificationToken,
      authPurpose: "verify-email",
    });

    //5.send email to verify otp
    const verificationUrl = `http://localhost:5001/v1/auth/verify-email/${verificationToken}`;

    const htmlBody = `
    <h1>Email Verification</h1>
    <p>Hello ${fullName},</p>
    <p>Please click the button below to verify your account:</p>
    <a href="${verificationUrl}" style="background: blue; color: white; padding: 10px; text-decoration: none;">
      Verify Email
    </a>
`;

    await sendEmail(email, "verify your email", htmlBody);

    //6. Return a success response with the created user data
    return res.status(httpStatus.CREATED).json({
      statusCode: httpStatus.CREATED,
      success: true,
      message: "User registered successfully",
      data: {
        id: user._id,
        profilePicture: user.profilePicture,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      statusCode: httpStatus.INTERNAL_SERVER_ERROR,
      success: false,
      message: "An error occurred during registration",
      error: error.message,
    });
  }
};

export const verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;

    const user = await User.findOneAndUpdate(
      { authToken: token, authPurpose: "verify-email" },
      { isEmailVerified: true, authToken: "", authPurpose: "" },
      { new: true },
    );

    if (!user) {
      return res.status(httpStatus.NOT_FOUND).json({
        success: false,
        message: "Invalid or expired verification token.",
      });
    }

    res.status(httpStatus.OK).json({
      success: true,
      message: "Email Verified Successfully",
    });
  } catch (error) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message,
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(httpStatus.UNAUTHORIZED).json({
        success: false,
        message: "Invalid credentials",
      });
    }
    // 2. check if user is verified
    if (!user.isEmailVerified) {
      return res.status(httpStatus.FORBIDDEN).json({
        success: false,
        message: "Please verify your email before logging in.",
      });
    }

    // 3. Compare Password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(httpStatus.UNAUTHORIZED).json({
        success: false,
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
      token: refreshToken,
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
    return res.status(httpStatus.OK).json({
      success: true,
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
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message,
    });
  }
};

export const refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.cookies;

    if (!refreshToken) {
      return res.status(httpStatus.UNAUTHORIZED).json({
        success: false,
        message: "No refresh token provided",
      });
    }

    // Check DB
    const storedToken = await TokenCollection.findOne({
      token: refreshToken,
    });

    if (!storedToken) {
      return res.status(401).json({
        success: false,
        message: "Invalid refresh token",
      });
    }
    // Verify refresh token
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

    // Generate NEW access token
    const newAccessToken = jwt.sign(
      {
        userId: decoded.userId,
      },
      process.env.JWT_SECRET,
      { expiresIn: "15m" },
    );

    // Send new access token cookie
    res.cookie("accessToken", newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "none",
      maxAge: 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      success: true,
      message: "Access token refreshed",
    });
  } catch (error) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message,
    });
  }
};

export const logout = async (req, res) => {
  try {
    const { refreshToken } = req.cookies;

    if (refreshToken) {
      await TokenCollection.deleteOne({ token: refreshToken });
    }

    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "none",
    });

    res.clearCookie("accessToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "none",
    });

    return res.status(httpStatus.OK).json({
      success: true,
      message: "Logout successful",
    });
  } catch (error) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message,
    });
  }
};
