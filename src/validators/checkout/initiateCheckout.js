import Joi from "joi";

// Schema for Initiate Checkout
export const initiateCheckoutSchema = Joi.object({
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

  billingInfo: Joi.object({
    fullName: Joi.string().trim().required().messages({
      "string.base": "Full name should be a string",
      "string.empty": "Full name cannot be empty",
      "any.required": "Full name is required",
    }),

    email: Joi.string().trim().email().required().messages({
      "string.base": "Email should be a string",
      "string.empty": "Email cannot be empty",
      "string.email": "Email must be a valid email",
      "any.required": "Email is required",
    }),

    streetAddress: Joi.string().trim().required().messages({
      "string.base": "Street address should be a string",
      "string.empty": "Street address cannot be empty",
      "any.required": "Street address is required",
    }),
  })
    .required()
    .messages({
      "object.base": "Billing info must be an object",
      "any.required": "Billing info is required",
    }),
});
