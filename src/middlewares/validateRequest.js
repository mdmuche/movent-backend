import httpStatus from "http-status";

import { errorResponse } from "../utils/response/error.js";

export const validateRequest = (schema, property = "body") => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req[property], {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      return errorResponse(res, {
        statusCode: httpStatus.BAD_REQUEST,
        message: "Validation failed",
        error: error.details.map((detail) => detail.message),
      });
    }

    Object.assign(req[property], value);

    return next();
  };
};
