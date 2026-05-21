import Joi from "joi";

// Schema for Export Reports
export const exportReportsSchema = Joi.object({
  format: Joi.string().valid("csv", "xlsx", "pdf").optional().messages({
    "string.base": "Format should be a string",
    "any.only": "Format must be one of csv, xlsx, or pdf",
  }),
});
