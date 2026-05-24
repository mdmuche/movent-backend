import mongoose from "mongoose";

const tokenSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  authPurpose: {
    type: String,
    required: true,
    enum: ["refresh_token", "password_reset", "email_verification"],
  },

  // Used for login sessions
  refreshToken: {
    type: String,
  },

  // Used for password reset (OTP or token)
  passwordResetToken: {
    type: String,
  },

  // Used for email verification
  emailVerificationToken: {
    type: String,
  },

  // Optional OTP support (if you use code-based reset)
  resetPasswordCode: {
    type: String,
  },

  isCodeVerified: {
    type: Boolean,
    default: false,
  },

  expiresAt: {
    type: Date,
    required: true,
  },
});

const TokenCollection = mongoose.model("Token", tokenSchema);

export default TokenCollection;
