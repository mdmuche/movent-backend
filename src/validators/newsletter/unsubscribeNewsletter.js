import Joi from "joi";

export const unsubscribeNewsletterSchema = Joi.object({
  email: Joi.string().email().lowercase().trim().required(),
});
