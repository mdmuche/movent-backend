import Joi from "joi";

// Schema for Apply Promo Code
export const applyPromoCodeSchema = Joi.object({
  code: Joi.string().trim().required().messages({
    "string.base": "Promo code should be a string",
    "string.empty": "Promo code cannot be empty",
    "any.required": "Promo code is required",
  }),

  quantity: Joi.number().integer().min(1).optional().messages({
    "number.base": "Quantity must be a number",
    "number.integer": "Quantity must be an integer",
    "number.min": "Quantity must be at least 1",
  }),
});
