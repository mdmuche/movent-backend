import Joi from "joi";

// Schema for Apply Promo Code
export const applyPromoCodeSchema = Joi.object({
  code: Joi.string().trim().required().messages({
    "string.base": "Promo code should be a string",
    "string.empty": "Promo code cannot be empty",
    "any.required": "Promo code is required",
  }),

  eventId: Joi.string().hex().length(24).required().messages({
    "string.base": "Event ID should be a string",
    "string.empty": "Event ID cannot be empty",
    "string.hex": "Event ID must be a valid MongoDB ObjectId",
    "string.length": "Event ID must be 24 characters long",
    "any.required": "Event ID is required",
  }),

  quantity: Joi.number().integer().min(1).optional().messages({
    "number.base": "Quantity must be a number",
    "number.integer": "Quantity must be an integer",
    "number.min": "Quantity must be at least 1",
  }),
});
