import Joi from "joi";

import { paginationSchema } from "../common/pagination.js";

export const getAllUsersSchema = paginationSchema.keys({
  role: Joi.string().optional(),
});
