import Joi from "joi";

export const deleteEventSchema = Joi.object({
  id: Joi.string().hex().length(24).required().messages({
    "string.base": "Event ID must be a string",
    "string.hex": "Event ID must be a valid hex string",
    "string.length": "Event ID must be a valid MongoDB ObjectId",
    "any.required": "Event ID is required",
  }),
});
