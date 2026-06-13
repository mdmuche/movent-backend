import httpStatus from "http-status";

import { successResponse } from "../../utils/response/success.js";
import { errorResponse } from "../../utils/response/error.js";
import AuditLog from "../../models/auditLog.js";

import { paginationUtils } from "../../utils/pagination/pagination.js";

export const getAuditLogs = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;

    // -----------------------------
    // TOTAL LOG COUNT
    // -----------------------------
    const total = await AuditLog.countDocuments();

    // -----------------------------
    // PAGINATION UTILS
    // -----------------------------
    const {
      skip,
      limit: limitNum,
      pagination,
    } = paginationUtils({
      page,
      limit,
      total,
    });

    // -----------------------------
    // FETCH PAGINATED LOGS
    // -----------------------------
    const logs = await AuditLog.find()
      .populate("performedBy", "fullName email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    return successResponse(res, {
      statusCode: httpStatus.OK,
      message: "Audit logs fetched successfully",
      data: {
        logs,
        pagination,
      },
    });
  } catch (error) {
    return errorResponse(res, {
      statusCode: httpStatus.INTERNAL_SERVER_ERROR,
      message: "Error fetching audit logs",
      error: error.message,
    });
  }
};
