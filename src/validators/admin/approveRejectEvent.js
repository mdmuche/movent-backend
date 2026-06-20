import Joi from "joi";

// Schema for approve/reject event path params
export const approveRejectEventParamsSchema = Joi.object({
  eventId: Joi.string().hex().length(24).required().messages({
    "string.base": "Event ID should be a string",
    "string.empty": "Event ID cannot be empty",
    "string.hex": "Event ID must be a valid MongoDB ObjectId",
    "string.length": "Event ID must be 24 characters long",
    "any.required": "Event ID is required",
  }),
});

// Schema for approve/reject event body
export const approveRejectEventBodySchema = Joi.object({
  action: Joi.string().valid("approve", "reject").required().messages({
    "string.base": "Action must be a string",
    "any.only": "Action must be either 'approve' or 'reject'",
    "any.required": "Action is required",
  }),
  reason: Joi.string()
    .when("action", {
      is: "reject",
      then: Joi.string().required().messages({
        "any.required": "A reason is required when rejecting an event",
        "string.empty": "Rejection reason cannot be empty",
      }),
      otherwise: Joi.string().optional(),
    })
    .messages({
      "string.base": "Reason must be a string",
    }),
});
