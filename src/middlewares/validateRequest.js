import httpStatus from "http-status";

import { errorResponse } from "../utils/response/error.js";

export const validateRequest = (schema, property = "body") => {
  return (req, res, next) => {
    const currentData = req[property] || {};

    const { error, value } = schema.validate(currentData, {
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

    // BODY can safely be reassigned
    if (property === "body") {
      req.body = value;
    }

    // QUERY/PARAMS should mutate existing object
    else {
      Object.assign(currentData, value);
    }

    return next();
  };
};
