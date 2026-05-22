import Joi from "joi";

// Schema for Get Payment Details
export const getPaymentDetailsSchema = Joi.object({
  reference: Joi.string().trim().required().messages({
    "string.base": "Reference should be a string",
    "string.empty": "Reference cannot be empty",
    "any.required": "Reference is required",
  }),
});
