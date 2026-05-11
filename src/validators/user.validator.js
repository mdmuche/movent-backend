import Joi from "joi";

// Schema forRegister
export const registerSchema = Joi.object({
  fullName: Joi.string().min(6).max(20).required(),
  email: Joi.string().email().required(),
  location: Joi.string().required(),
  password: Joi.string().min(8).required(),
  profilePicture: Joi.string()
    .uri()
    .default("https://cdn-icons-png.flaticon.com/128/2202/2202112.png"),
  role: Joi.string().valid("user", "scout", "admin").default("user"),
});

// Schema for Login
export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(), // No min length here; just check if it exists
});
