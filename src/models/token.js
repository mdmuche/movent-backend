import mongoose from "mongoose";

const tokenSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  refreshToken: {
    type: String,
    required: true,
  },
  resetToken: {
    type: String,
    required: true,
  },
  authPurpose: {
    type: String,
  },
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
