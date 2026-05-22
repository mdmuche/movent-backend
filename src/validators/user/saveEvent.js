import Joi from "joi";

export const saveEventSchema = Joi.object({
  eventId: Joi.string().hex().length(24).required().messages({
    "string.base": "Event ID must be a string",
    "string.empty": "Event ID is required",
    "string.hex": "Event ID must be a valid MongoDB ObjectId",
    "string.length": "Event ID must be a valid MongoDB ObjectId",
    "any.required": "Event ID is required",
  }),
});
