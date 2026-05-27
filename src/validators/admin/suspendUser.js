import Joi from "joi";

// Schema for Suspend User
export const suspendUserSchema = Joi.object({
  userId: Joi.string().hex().length(24).required().messages({
    "string.base": "User ID should be a string",
    "string.empty": "User ID cannot be empty",
    "string.hex": "User ID must be a valid MongoDB ObjectId",
    "string.length": "User ID must be 24 characters long",
    "any.required": "User ID is required",
  }),
});

export const suspendUserBodySchema = Joi.object({
  reason: Joi.string().optional().messages({
    "string.base": "Reason must be a string",
  }),
});
