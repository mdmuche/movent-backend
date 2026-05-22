import Joi from "joi";

export const updateProfileSchema = Joi.object({
  fullName: Joi.string().trim().min(2).max(100).messages({
    "string.base": "Full name must be a string",
    "string.empty": "Full name cannot be empty",
    "string.min": "Full name must be at least 2 characters long",
    "string.max": "Full name cannot exceed 100 characters",
  }),

  email: Joi.string().trim().email().messages({
    "string.base": "Email must be a string",
    "string.email": "Please provide a valid email address",
    "string.empty": "Email cannot be empty",
  }),

  bio: Joi.string().trim().max(300).messages({
    "string.base": "Bio must be a string",
    "string.max": "Bio cannot exceed 300 characters",
  }),
});
