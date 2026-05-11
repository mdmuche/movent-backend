import httpStatus from "http-status";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { v4 } from "uuid";

import User from "../models/users.model.js";
import { sendEmail } from "../utils/email.util.js";

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

    const loginToken = jwt.sign(
      {
        userId: user._id,
        role: user.role,
        fullName: user.fullName,
        email: user.email,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" },
    );

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
        loginToken,
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
    const token = jwt.sign(
      {
        userId: user._id,
        role: user.role,
        fullName: user.fullName,
        email: user.email,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" },
    );

    // 5. Send Response
    return res.status(httpStatus.OK).json({
      success: true,
      message: "Login successful",
      token: token,
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
