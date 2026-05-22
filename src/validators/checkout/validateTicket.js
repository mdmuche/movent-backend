import Joi from "joi";

// Schema for Validate Ticket
export const validateTicketSchema = Joi.object({
  ticketId: Joi.string().hex().length(24).required().messages({
    "string.base": "Ticket ID should be a string",
    "string.empty": "Ticket ID cannot be empty",
    "string.hex": "Ticket ID must be a valid MongoDB ObjectId",
    "string.length": "Ticket ID must be 24 characters long",
    "any.required": "Ticket ID is required",
  }),
});
