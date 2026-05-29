import Joi from "joi";

export const purchaseTicketSchema = Joi.object({
  quantity: Joi.number().required(),

  ticketType: Joi.string().valid("regular", "vip").optional(),
});
