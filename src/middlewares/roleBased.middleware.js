import httpStatus from "http-status";

export const rolesAllowed = (...roles) => {
  return (req, res, next) => {
    if (roles.includes(req.user.role)) {
      next();
    }

    return res.status(httpStatus.FORBIDDEN).json({
      statusCode: httpStatus.FORBIDDEN,
      success: false,
      message:
        "Access Denied: Your role does not have permission to view this route",
    });
  };
};
