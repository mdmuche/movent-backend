import Joi from "joi";

// Schema for Verify Code
export const verifyCodeSchema = Joi.object({
  resetToken: Joi.string().required().messages({
    "string.base": "Reset token should be a string",
    "string.empty": "Reset token cannot be empty",
    "any.required": "Reset token is required",
  }),

  code: Joi.string().length(4).required().messages({
    "string.base": "Code should be a string",
    "string.empty": "Code cannot be empty",
    "string.length": "Code must be exactly 4 digits",
    "any.required": "Code is required",
  }),
});
