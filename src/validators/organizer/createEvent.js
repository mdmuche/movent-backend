import Joi from "joi";

export const createEventSchema = Joi.object({
  title: Joi.string().trim().required().messages({
    "string.base": "Title must be a string",
    "string.empty": "Title is required",
    "any.required": "Title is required",
  }),

  description: Joi.string().trim().required().messages({
    "string.base": "Description must be a string",
    "string.empty": "Description is required",
    "any.required": "Description is required",
  }),

  category: Joi.string().trim().required().messages({
    "string.base": "Category must be a string",
    "string.empty": "Category is required",
    "any.required": "Category is required",
  }),

  venue: Joi.string().trim().required().messages({
    "string.base": "Venue must be a string",
    "string.empty": "Venue is required",
    "any.required": "Venue is required",
  }),

  city: Joi.string().trim().required().messages({
    "string.base": "City must be a string",
    "string.empty": "City is required",
    "any.required": "City is required",
  }),

  state: Joi.string().trim().required().messages({
    "string.base": "State must be a string",
    "string.empty": "State is required",
    "any.required": "State is required",
  }),

  country: Joi.string().trim().required().messages({
    "string.base": "Country must be a string",
    "string.empty": "Country is required",
    "any.required": "Country is required",
  }),

  startDate: Joi.date().required().messages({
    "date.base": "Start date must be a valid date",
    "any.required": "Start date is required",
  }),

  endDate: Joi.date().min(Joi.ref("startDate")).required().messages({
    "date.base": "End date must be a valid date",
    "date.min": "End date cannot be before start date",
    "any.required": "End date is required",
  }),

  startTime: Joi.string().required().messages({
    "string.base": "Start time must be a string",
    "string.empty": "Start time is required",
    "any.required": "Start time is required",
  }),

  endTime: Joi.string().required().messages({
    "string.base": "End time must be a string",
    "string.empty": "End time is required",
    "any.required": "End time is required",
  }),

  isFree: Joi.boolean().required().messages({
    "boolean.base": "isFree must be true or false",
    "any.required": "isFree is required",
  }),

  ticketPrice: Joi.number().min(0).optional().messages({
    "number.base": "Ticket price must be a number",
    "number.min": "Ticket price cannot be negative",
  }),

  totalTickets: Joi.number().integer().min(1).required().messages({
    "number.base": "Total tickets must be a number",
    "number.min": "Total tickets must be at least 1",
    "any.required": "Total tickets is required",
  }),

  tags: Joi.alternatives()
    .try(Joi.array().items(Joi.string()), Joi.string())
    .optional()
    .messages({
      "array.base": "Tags must be an array of strings",
      "string.base": "Tags must be a string or array",
    }),

  entryRequirements: Joi.string().allow("").optional(),

  bannerImage: Joi.string().trim().optional().messages({
    "string.base": "Banner image must be a string",
  }),

  agreedToRefundPolicy: Joi.boolean().valid(true).required().messages({
    "any.only": "You must agree to the refund policy",
    "any.required": "Refund policy agreement is required",
  }),
});
