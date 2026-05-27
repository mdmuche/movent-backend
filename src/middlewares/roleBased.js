import httpStatus from "http-status";
import { errorResponse } from "../utils/response/error.js";

export const rolesAllowed = (...roles) => {
  return (req, res, next) => {
    const role = req.userDetails?.role || req.user?.role;

    if (roles.includes(role)) {
      return next();
    }

    return errorResponse(res, {
      statusCode: httpStatus.FORBIDDEN,
      message:
        "Access Denied: Your role does not have permission to view this route",
    });
  };
};
