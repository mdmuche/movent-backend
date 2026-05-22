import Joi from "joi";
import { paginationSchema } from "../common/pagination.js";

export const getSubscribersSchema = paginationSchema.keys({
  isSubscribed: Joi.boolean().optional(),
});
