import Joi from "joi";

// Schema forRegister
export const registerSchema = Joi.object({
  fullName: Joi.string().trim().min(3).max(50).required().messages({
    "string.base": "Full Name should be a string",
    "string.empty": "Full Name cannot be empty",
    "string.min": "Full Name must be at least 3 characters",
    "string.max": "Full Name cannot exceed 50 characters",
    "any.required": "Full Name is required",
  }),
  email: Joi.string().trim().email().required().messages({
    "string.base": "Email should be a string",
    "string.empty": "Email cannot be empty",
    "string.email": "Email must be a valid email",
    "any.required": "Email is required",
  }),
  password: Joi.string()
    .min(8)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/)
    .required()
    .messages({
      "string.base": "Password should be a string",
      "string.empty": "Password cannot be empty",
      "string.min": "Password must be at least 8 characters",
      "string.pattern.base":
        "Password must contain at least one uppercase letter, one lowercase letter, and one digit",
      "any.required": "Password is required",
    }),
  profilePicture: Joi.string()
    .uri()
    .default("https://cdn-icons-png.flaticon.com/128/2202/2202112.png"),
});

// Schema for Login
export const loginSchema = Joi.object({
  email: Joi.string().trim().email().required().messages({
    "string.base": "Email should be a string",
    "string.empty": "Email cannot be empty",
    "string.email": "Email must be a valid email",
    "any.required": "Email is required",
  }),
  password: Joi.string().required().messages({
    "string.base": "Password should be a string",
    "string.empty": "Password cannot be empty",
    "any.required": "Password is required",
  }),
});
