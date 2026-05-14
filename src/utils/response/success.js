import httpStatus from "http-status";

export const successResponse = (
  res,
  { statusCode = httpStatus.OK, message = "Success", data = null },
) => {
  return res.status(statusCode).json({
    statusCode,
    success: true,
    message,
    data,
  });
};
