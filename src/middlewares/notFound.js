import httpStatus from "http-status";

import { errorResponse } from "../utils/response/error.js";

export const notFound = (req, res) => {
  return errorResponse(res, {
    statusCode: httpStatus.NOT_FOUND,
    message: "Sorry that route does not exist.",
  });
};
