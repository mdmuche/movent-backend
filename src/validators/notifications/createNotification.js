import Joi from "joi";

export const createNotificationSchema = Joi.object({
  user: Joi.string().required().messages({
    "string.base": "User ID must be a string",
    "string.empty": "User ID cannot be empty",
    "any.required": "User ID is required",
  }),

  title: Joi.string().trim().required().messages({
    "string.base": "Title must be a string",
    "string.empty": "Title cannot be empty",
    "any.required": "Title is required",
  }),

  message: Joi.string().trim().required().messages({
    "string.base": "Message must be a string",
    "string.empty": "Message cannot be empty",
    "any.required": "Message is required",
  }),

  type: Joi.string()
    .valid("system", "event", "payment", "ticket", "reminder", "general")
    .required()
    .messages({
      "string.base": "Type must be a string",
      "any.only": "Invalid notification type",
      "any.required": "Notification type is required",
    }),

  metadata: Joi.object().optional(),
});
