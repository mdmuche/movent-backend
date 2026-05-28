import { Schema, model } from "mongoose";
import bcrypt from "bcryptjs";

const saltRounds = 10;

// Define the User schema
const userSchema = new Schema(
  {
    fullName: {
      type: String,
      required: true,
      unique: true,
      minlength: 2,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    bio: {
      type: String,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    isVerifiedOrganizer: {
      type: Boolean,
      default: false,
    },
    reputationScore: {
      type: Number,
      default: 0,
    },
    location: {
      type: String,
    },
    password: {
      type: String,
      required: true,
    },
    profilePicture: {
      type: String,
      default: "https://cdn-icons-png.flaticon.com/128/2202/2202112.png",
    },
    language: {
      type: String,
      enum: ["en", "fr", "es", "pt", "de", "zh", "ar", "ha", "yo", "ig"],
      default: "en",
    },
    interests: {
      type: [String],
    },
    role: {
      type: String,
      enum: ["attendee", "organizer", "admin"],
      default: "attendee",
    },
    accountStatus: {
      type: String,
      enum: ["active", "deleted", "closed"],
      default: "active",
    },
    accountModerationStatus: {
      type: String,
      enum: ["none", "flagged", "suspended"],
      default: "none",
    },
    subscriptionPlan: {
      type: String,
      enum: ["free", "pro"],
      default: "free",
    },
    closedAt: {
      type: Date,
      default: null,
    },
    deletedAt: {
      type: Date,
      default: null,
    },
    lastLoginAt: {
      type: Date,
      default: null,
    },
    authToken: {
      type: String,
    },
    authPurpose: {
      type: String,
    },
    savedEvents: [
      {
        type: Schema.Types.ObjectId,
        ref: "Event",
      },
    ],
  },
  { timestamps: true },
);

userSchema.pre("save", async function () {
  // Only hash the password if it's new or being modified
  if (!this.isModified("password")) return;

  const salt = await bcrypt.genSalt(saltRounds);
  this.password = await bcrypt.hash(this.password, salt);
});

// Create the User model
const User = model("User", userSchema);

export default User;
