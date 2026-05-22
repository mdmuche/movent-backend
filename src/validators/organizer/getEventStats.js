import Joi from "joi";

export const getEventStatsSchema = Joi.object({
  id: Joi.string().hex().length(24).required().messages({
    "string.base": "Event ID must be a string",
    "string.empty": "Event ID is required",
    "string.length": "Event ID must be a valid MongoDB ObjectId",
    "string.hex": "Event ID must be a valid MongoDB ObjectId",
    "any.required": "Event ID is required",
  }),
});
