import httpStatus from "http-status";
import { v4 } from "uuid";

import { successResponse } from "../../utils/response/success.js";
import { errorResponse } from "../../utils/response/error.js";
import User from "../../models/user.js";
import { sendEmail } from "../../utils/email/sendEmail.js";
import { verifyEmailTemplate } from "../../utils/email/templates/verifyEmail.js";
import TokenCollection from "../../models/token.js";

export const register = async (req, res) => {
  try {
    //1. Get user input
    const { fullName, email, password } = req.body;

    //2. Check if the user already exists in the database
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return errorResponse(res, {
        statusCode: httpStatus.CONFLICT,
        message: "User already exists with this email",
      });
    }

    const verificationToken = v4();

    //4. Create a new user
    const user = await User.create({
      fullName,
      email,
      password: password,
      authToken: verificationToken,
      authPurpose: "verify-email",
    });

    //5.send email to verify otp
    const verificationUrl = `${process.env.FRONTEND_TEST_URL}/verify-email/${verificationToken}`;

    const emailBody = verifyEmailTemplate(user.fullName, verificationUrl);
    await sendEmail(email, "verify your email", emailBody);

    // store email verification token
    await TokenCollection.create({
      user: user._id,
      authPurpose: "email_verification",
      emailVerificationToken: verificationToken,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
    });

    //6. Return a success response with the created user data
    return successResponse(res, {
      statusCode: httpStatus.CREATED,
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
    return errorResponse(res, {
      statusCode: httpStatus.INTERNAL_SERVER_ERROR,
      message: "An error occurred during registration",
      error: error.message,
    });
  }
};
