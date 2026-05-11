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
      minlength: 6,
      maxlength: 20,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    location: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    profilePicture: {
      type: String,
      default: "https://cdn-icons-png.flaticon.com/128/2202/2202112.png",
    },
    role: {
      type: String,
      enum: ["user", "scout", "admin"],
      default: "user",
    },
    authToken: {
      type: String,
    },
    authPurpose: {
      type: String,
    },
  },
  { timestamps: true },
);

userSchema.pre("save", async function (next) {
  // Only hash the password if it's new or being modified
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(saltRounds);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Create the User model
const User = model("User", userSchema);

export default User;
