import Joi from "joi";

export const verifyEmailParamsSchema = Joi.object({
  token: Joi.string().trim().required().messages({
    "string.base": "Verification token must be a string",
    "string.empty": "Verification token is required",
    "any.required": "Verification token is required",
  }),
});

export const resetPasswordParamsSchema = Joi.object({
  resetToken: Joi.string().trim().required().messages({
    "string.base": "Reset token must be a string",
    "string.empty": "Reset token is required",
    "any.required": "Reset token is required",
  }),
});
