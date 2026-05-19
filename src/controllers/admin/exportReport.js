import httpStatus from "http-status";

import { Parser } from "json2csv";
import ExcelJS from "exceljs";
import PDFDocument from "pdfkit";

import User from "../../models/user.js";
import Event from "../../models/event.js";
import TicketCollection from "../../models/ticket.js";

import { errorResponse } from "../../utils/response/error.js";

export const exportReports = async (req, res) => {
  try {
    const { format = "csv" } = req.query;

    // ---------------------------------
    // PLATFORM DATA
    // ---------------------------------
    const totalUsers = await User.countDocuments();

    const totalEvents = await Event.countDocuments();

    const pendingEvents = await Event.countDocuments({
      approvalStatus: "pending",
    });

    const tickets = await TicketCollection.find({
      paymentStatus: "paid",
    });

    const totalRevenue = tickets.reduce((acc, ticket) => {
      return acc + (ticket.totalAmount || 0);
    }, 0);

    const reportData = [
      {
        totalUsers,
        totalEvents,
        pendingEvents,
        totalRevenue,
        totalTicketsSold: tickets.length,
      },
    ];

    // ---------------------------------
    // CSV EXPORT
    // ---------------------------------
    if (format === "csv") {
      const parser = new Parser();

      const csv = parser.parse(reportData);

      res.header("Content-Type", "text/csv");

      res.attachment("platform-report.csv");

      return res.status(httpStatus.OK).send(csv);
    }

    // ---------------------------------
    // XLSX EXPORT
    // ---------------------------------
    if (format === "xlsx") {
      const workbook = new ExcelJS.Workbook();

      const worksheet = workbook.addWorksheet("Platform Report");

      worksheet.columns = [
        {
          header: "Total Users",
          key: "totalUsers",
          width: 20,
        },
        {
          header: "Total Events",
          key: "totalEvents",
          width: 20,
        },
        {
          header: "Pending Events",
          key: "pendingEvents",
          width: 20,
        },
        {
          header: "Total Revenue",
          key: "totalRevenue",
          width: 20,
        },
        {
          header: "Total Tickets Sold",
          key: "totalTicketsSold",
          width: 25,
        },
      ];

      worksheet.addRows(reportData);

      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      );

      res.setHeader(
        "Content-Disposition",
        "attachment; filename=platform-report.xlsx",
      );

      await workbook.xlsx.write(res);

      return res.end();
    }

    // ---------------------------------
    // PDF EXPORT
    // ---------------------------------
    if (format === "pdf") {
      const doc = new PDFDocument();

      res.setHeader("Content-Type", "application/pdf");

      res.setHeader(
        "Content-Disposition",
        "attachment; filename=platform-report.pdf",
      );

      doc.pipe(res);

      doc.fontSize(20).text("Movent Platform Report", {
        align: "center",
      });

      doc.moveDown();

      doc.fontSize(14).text(`Total Users: ${totalUsers}`);

      doc.text(`Total Events: ${totalEvents}`);

      doc.text(`Pending Events: ${pendingEvents}`);

      doc.text(`Total Revenue: ${totalRevenue}`);

      doc.text(`Total Tickets Sold: ${tickets.length}`);

      doc.end();

      return;
    }

    // ---------------------------------
    // INVALID FORMAT
    // ---------------------------------
    return errorResponse(res, {
      statusCode: httpStatus.BAD_REQUEST,
      message: "Invalid export format",
    });
  } catch (error) {
    return errorResponse(res, {
      statusCode: httpStatus.INTERNAL_SERVER_ERROR,
      message: "Error exporting reports",
      error: error.message,
    });
  }
};
