import Joi from "joi";

export const createEventSchema = Joi.object({
  title: Joi.string().trim().min(3).max(100).required().messages({
    "string.base": "Title should be a string",
    "string.empty": "Title cannot be empty",
    "string.min": "Title must be at least 3 characters",
    "string.max": "Title cannot exceed 100 characters",
    "any.required": "Title is required",
  }),

  description: Joi.string().trim().min(10).max(2000).required().messages({
    "string.base": "Description should be a string",
    "string.empty": "Description cannot be empty",
    "string.min": "Description must be at least 10 characters",
    "string.max": "Description cannot exceed 2000 characters",
    "any.required": "Description is required",
  }),

  category: Joi.string()
    .valid(
      "music",
      "tech",
      "business",
      "sports",
      "education",
      "fashion",
      "comedy",
      "gaming",
      "other",
    )
    .required()
    .messages({
      "any.only": "Invalid category selected",
      "any.required": "Category is required",
    }),

  venue: Joi.string().trim().min(3).max(150).required().messages({
    "string.base": "Venue should be a string",
    "string.empty": "Venue cannot be empty",
    "any.required": "Venue is required",
  }),

  city: Joi.string().trim().min(2).max(100).required().messages({
    "string.base": "City should be a string",
    "any.required": "City is required",
  }),

  state: Joi.string().trim().max(100).allow("").optional(),

  country: Joi.string().trim().min(2).max(100).required().messages({
    "any.required": "Country is required",
  }),

  startDate: Joi.date().iso().required().messages({
    "any.required": "Start date is required",
    "date.base": "Start date must be a valid date",
  }),

  endDate: Joi.date().iso().greater(Joi.ref("startDate")).required().messages({
    "any.required": "End date is required",
    "date.base": "End date must be a valid date",
    "date.greater": "End date must be after start date",
  }),

  startTime: Joi.string().optional(),

  endTime: Joi.string().optional(),

  isFree: Joi.boolean().default(false),

  ticketPrice: Joi.number()
    .min(0)
    .when("isFree", {
      is: false,
      then: Joi.required(),
      otherwise: Joi.forbidden(),
    })
    .messages({
      "number.base": "Ticket price must be a number",
      "number.min": "Ticket price cannot be negative",
      "any.required": "Ticket price is required for paid events",
    }),

  totalTickets: Joi.number().integer().min(1).required().messages({
    "number.base": "Total tickets must be a number",
    "number.min": "At least 1 ticket is required",
    "any.required": "Total tickets is required",
  }),

  tags: Joi.array().items(Joi.string().trim().lowercase()).optional(),

  bannerImage: Joi.string().uri().optional(),
});
