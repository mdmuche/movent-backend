import Joi from "joi";

export const createPromoCodeSchema = Joi.object({
  discountType: Joi.string().valid("percentage", "fixed").required().messages({
    "any.only": "Discount type must be either percentage or fixed",
    "any.required": "Discount type is required",
    "string.base": "Discount type must be a string",
  }),

  discountValue: Joi.number().positive().required().messages({
    "number.base": "Discount value must be a number",
    "number.positive": "Discount value must be greater than 0",
    "any.required": "Discount value is required",
  }),

  durationDays: Joi.number().integer().min(1).max(365).required().messages({
    "number.base": "Duration must be a number",
    "number.integer": "Duration must be an integer",
    "number.min": "Duration must be at least 1 day",
    "number.max": "Duration cannot exceed 365 days",
    "any.required": "Duration is required",
  }),

  isActive: Joi.boolean().optional().messages({
    "boolean.base": "isActive must be true or false",
  }),

  usageLimit: Joi.number().integer().min(1).optional().messages({
    "number.base": "Usage limit must be a number",
    "number.integer": "Usage limit must be an integer",
    "number.min": "Usage limit must be at least 1",
  }),
});
