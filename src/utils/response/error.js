import httpStatus from "http-status";

export const errorResponse = (
  res,
  {
    statusCode = httpStatus.INTERNAL_SERVER_ERROR,
    message = "Something went wrong",
    error = null,
  },
) => {
  return res.status(statusCode).json({
    statusCode,
    success: false,
    message,
    error,
  });
};
