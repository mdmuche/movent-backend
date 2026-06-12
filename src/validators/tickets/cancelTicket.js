import Joi from "joi";

export const cancelTicketSchema = Joi.object({
  ticketId: Joi.string().hex().length(24).required(),
});
