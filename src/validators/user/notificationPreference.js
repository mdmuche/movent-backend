import Joi from "joi";

export const updateNotificationPreferencesSchema = Joi.object({
  eventUpdates: Joi.boolean().required().messages({
    "boolean.base": "eventUpdates must be a boolean value",
    "any.required": "eventUpdates is required",
  }),

  promotionalOffers: Joi.boolean().required().messages({
    "boolean.base": "promotionalOffers must be a boolean value",
    "any.required": "promotionalOffers is required",
  }),

  securityAlerts: Joi.boolean().required().messages({
    "boolean.base": "securityAlerts must be a boolean value",
    "any.required": "securityAlerts is required",
  }),
});
