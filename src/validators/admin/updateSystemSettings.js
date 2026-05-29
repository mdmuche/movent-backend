import Joi from "joi";

export const updateSystemSettingsSchema = Joi.object({
  platformCommission: Joi.number().min(0).max(100).optional().messages({
    "number.base": "Platform commission must be a number",
  }),

  maxTicketPerPurchase: Joi.number().min(1).optional().messages({
    "number.base": "Max ticket per purchase must be a number",
  }),

  maintenanceMode: Joi.boolean().optional().messages({
    "boolean.base": "Maintenance mode must be true or false",
  }),

  supportEmail: Joi.string().email().optional().messages({
    "string.email": "Support email must be valid",
  }),
});
