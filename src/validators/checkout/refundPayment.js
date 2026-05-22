import Joi from "joi";

// Schema for Refund Payment
export const refundPaymentSchema = Joi.object({
  paymentId: Joi.string().hex().length(24).required().messages({
    "string.base": "Payment ID should be a string",
    "string.empty": "Payment ID cannot be empty",
    "string.hex": "Payment ID must be a valid MongoDB ObjectId",
    "string.length": "Payment ID must be 24 characters long",
    "any.required": "Payment ID is required",
  }),
});
