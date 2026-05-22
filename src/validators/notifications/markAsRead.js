import Joi from "joi";

export const markAsReadSchema = Joi.object({
  notificationId: Joi.string().required().messages({
    "string.base": "Notification ID must be a string",
    "string.empty": "Notification ID cannot be empty",
    "any.required": "Notification ID is required",
  }),
});
