import Joi from "joi";

export const purchaseTicketSchema = Joi.object({
  eventId: Joi.string().required().messages({
    "string.base": "Event ID must be a string",
    "any.required": "Event ID is required",
  }),

  quantity: Joi.number().integer().min(1).optional().messages({
    "number.base": "Quantity must be a number",
    "number.min": "Quantity must be at least 1",
  }),
});
