import Joi from "joi";

export const updateEventSchema = Joi.object({
  title: Joi.string().trim().min(3).max(100).messages({
    "string.base": "Title must be a string",
    "string.min": "Title must be at least 3 characters long",
    "string.max": "Title cannot exceed 100 characters",
  }),

  description: Joi.string().trim().min(10).messages({
    "string.base": "Description must be a string",
    "string.min": "Description must be at least 10 characters long",
  }),

  category: Joi.string().trim().messages({
    "string.base": "Category must be a string",
  }),

  venue: Joi.string().trim().messages({
    "string.base": "Venue must be a string",
  }),

  city: Joi.string().trim().messages({
    "string.base": "City must be a string",
  }),

  state: Joi.string().trim().messages({
    "string.base": "State must be a string",
  }),

  country: Joi.string().trim().messages({
    "string.base": "Country must be a string",
  }),

  startDate: Joi.date().messages({
    "date.base": "Start date must be a valid date",
  }),

  endDate: Joi.date().messages({
    "date.base": "End date must be a valid date",
  }),

  startTime: Joi.string().messages({
    "string.base": "Start time must be a string",
  }),

  endTime: Joi.string().messages({
    "string.base": "End time must be a string",
  }),

  isFree: Joi.boolean().messages({
    "boolean.base": "isFree must be true or false",
  }),

  ticketPrice: Joi.number().min(0).messages({
    "number.base": "Ticket price must be a number",
    "number.min": "Ticket price cannot be negative",
  }),

  totalTickets: Joi.number().integer().min(1).messages({
    "number.base": "Total tickets must be a number",
    "number.min": "Total tickets must be at least 1",
    "number.integer": "Total tickets must be an integer",
  }),

  tags: Joi.alternatives()
    .try(Joi.array().items(Joi.string().trim()), Joi.string())
    .messages({
      "alternatives.match": "Tags must be an array of strings or a string",
    }),

  entryRequirements: Joi.string().allow("").messages({
    "string.base": "Entry requirements must be a string",
  }),

  longitude: Joi.number().min(-180).max(180).messages({
    "number.base": "Longitude must be a number",
    "number.min": "Longitude cannot be less than -180",
    "number.max": "Longitude cannot be greater than 180",
  }),

  latitude: Joi.number().min(-90).max(90).messages({
    "number.base": "Latitude must be a number",
    "number.min": "Latitude cannot be less than -90",
    "number.max": "Latitude cannot be greater than 90",
  }),

  agreedToRefundPolicy: Joi.boolean().messages({
    "boolean.base": "Refund policy agreement must be true or false",
  }),
});
