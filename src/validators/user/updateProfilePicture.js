import Joi from "joi";

export const updateProfilePictureSchema = Joi.object({
  file: Joi.any().required().messages({
    "any.required": "Profile picture image is required",
  }),
});
