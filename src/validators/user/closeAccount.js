import Joi from "joi";

export const closeAccountSchema = Joi.object({
  body: Joi.object({}).forbidden().messages({
    "object.unknown": "Request body is not allowed for this operation",
  }),

  query: Joi.object({}).forbidden().messages({
    "object.unknown": "Query parameters are not allowed for this operation",
  }),

  params: Joi.object({}).forbidden().messages({
    "object.unknown": "URL parameters are not allowed for this operation",
  }),
});
