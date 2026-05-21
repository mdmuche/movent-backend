import Joi from "joi";

// Schema for Forgot Password
export const forgotPasswordSchema = Joi.object({
  email: Joi.string().trim().email().required().messages({
    "string.base": "Email should be a string",
    "string.empty": "Email cannot be empty",
    "string.email": "Email must be a valid email",
    "any.required": "Email is required",
  }),
});
