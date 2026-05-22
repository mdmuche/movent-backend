import Joi from "joi";
import { paginationSchema } from "../common/pagination.js";

export const getAllEventsSchema = paginationSchema.keys({
  search: Joi.string().trim().optional(),

  category: Joi.string().trim().optional(),

  status: Joi.string().valid("upcoming", "past", "available").optional(),

  sort: Joi.string()
    .valid("latest", "oldest", "price_asc", "price_desc", "popularity")
    .optional(),

  city: Joi.string().trim().optional(),

  lng: Joi.number().optional(),
  lat: Joi.number().optional(),
  radius: Joi.number().min(1).optional(),
});
