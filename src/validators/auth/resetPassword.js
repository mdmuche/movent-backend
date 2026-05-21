import Joi from "joi";

// Schema for Reset Password
export const resetPasswordSchema = Joi.object({
  newPassword: Joi.string().min(6).required().messages({
    "string.base": "Password should be a string",
    "string.empty": "Password cannot be empty",
    "string.min": "Password must be at least 6 characters",
    "any.required": "New password is required",
  }),
});
