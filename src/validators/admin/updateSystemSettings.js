import Joi from "joi";

// Schema for Update System Settings
export const updateSystemSettingsSchema = Joi.object({
  platformName: Joi.string().optional().messages({
    "string.base": "Platform name must be a string",
  }),

  maintenanceMode: Joi.boolean().optional().messages({
    "boolean.base": "Maintenance mode must be true or false",
  }),

  supportEmail: Joi.string().email().optional().messages({
    "string.base": "Support email must be a string",
    "string.email": "Support email must be a valid email",
  }),

  currency: Joi.string().optional().messages({
    "string.base": "Currency must be a string",
  }),

  commissionRate: Joi.number().min(0).max(100).optional().messages({
    "number.base": "Commission rate must be a number",
    "number.min": "Commission rate cannot be negative",
    "number.max": "Commission rate cannot exceed 100",
  }),

  payoutEnabled: Joi.boolean().optional().messages({
    "boolean.base": "Payout enabled must be true or false",
  }),
});
