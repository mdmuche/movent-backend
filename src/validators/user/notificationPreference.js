import Joi from "joi";

export const updateNotificationPreferencesSchema = Joi.object({
  eventUpdates: Joi.boolean().messages({
    "boolean.base": "eventUpdates must be a boolean value",
  }),

  promotionalOffers: Joi.boolean().messages({
    "boolean.base": "promotionalOffers must be a boolean value",
  }),

  securityAlerts: Joi.boolean().messages({
    "boolean.base": "securityAlerts must be a boolean value",
  }),
});
