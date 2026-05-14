import Joi from "joi";

// Schema for Login
export const loginSchema = Joi.object({
  email: Joi.string().trim().email().required().messages({
    "string.base": "Email should be a string",
    "string.empty": "Email cannot be empty",
    "string.email": "Email must be a valid email",
    "any.required": "Email is required",
  }),
  password: Joi.string().required().messages({
    "string.base": "Password should be a string",
    "string.empty": "Password cannot be empty",
    "any.required": "Password is required",
  }),
});
