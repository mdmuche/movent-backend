import Joi from "joi";

export const createPromoCodeSchema = Joi.object({
  code: Joi.string().trim().min(3).max(30).required().messages({
    "string.base": "Promo code must be a string",
    "string.empty": "Promo code cannot be empty",
    "string.min": "Promo code must be at least 3 characters",
    "string.max": "Promo code must not exceed 30 characters",
    "any.required": "Promo code is required",
  }),

  discountType: Joi.string().valid("percentage", "fixed").required().messages({
    "any.only": "Discount type must be either percentage or fixed",
    "any.required": "Discount type is required",
  }),

  discountValue: Joi.number().positive().required().messages({
    "number.base": "Discount value must be a number",
    "number.positive": "Discount value must be greater than 0",
    "any.required": "Discount value is required",
  }),

  isActive: Joi.boolean().optional().messages({
    "boolean.base": "isActive must be true or false",
  }),

  expiresAt: Joi.date().optional().messages({
    "date.base": "expiresAt must be a valid date",
  }),

  usageLimit: Joi.number().integer().min(1).optional().messages({
    "number.base": "usageLimit must be a number",
    "number.integer": "usageLimit must be an integer",
    "number.min": "usageLimit must be at least 1",
  }),
});
