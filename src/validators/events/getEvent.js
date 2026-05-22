import Joi from "joi";

export const getEventSchema = Joi.object({
  slug: Joi.string().trim().required().messages({
    "string.base": "Slug must be a string",
    "string.empty": "Slug cannot be empty",
    "any.required": "Slug is required",
  }),
});
