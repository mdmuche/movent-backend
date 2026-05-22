import Joi from "joi";

export const updateLanguageSchema = Joi.object({
  language: Joi.string()
    .trim()
    .required()
    .valid("en", "fr", "es", "pt", "de", "zh", "ar", "ha", "yo", "ig")
    .messages({
      "string.base": "Language must be a string",
      "string.empty": "Language is required",
      "any.required": "Language is required",
      "any.only": "Invalid language selected",
    }),
});
