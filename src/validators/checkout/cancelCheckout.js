import Joi from "joi";

// Schema for Cancel Checkout
export const cancelCheckoutSchema = Joi.object({
  reference: Joi.string().trim().required().messages({
    "string.base": "Reference should be a string",
    "string.empty": "Reference cannot be empty",
    "any.required": "Reference is required",
  }),
});
