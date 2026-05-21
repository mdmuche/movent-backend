import Joi from "joi";

// Schema for Make Organizer
export const makeOrganizerSchema = Joi.object({
  id: Joi.string().hex().length(24).required().messages({
    "string.base": "User ID should be a string",
    "string.empty": "User ID cannot be empty",
    "string.hex": "User ID must be a valid MongoDB ObjectId",
    "string.length": "User ID must be 24 characters long",
    "any.required": "User ID is required",
  }),
});
