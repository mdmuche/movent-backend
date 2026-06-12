import httpStatus from "http-status";

import { Parser } from "json2csv";
import ExcelJS from "exceljs";
import PDFDocument from "pdfkit";

import User from "../../models/user.js";
import Event from "../../models/event.js";
import TicketCollection from "../../models/ticket.js";

import { errorResponse } from "../../utils/response/error.js";

/**
 * ----------------------------------------
 * BUILD REPORT DATA (REUSABLE CORE LOGIC)
 * ----------------------------------------
 */
const buildPlatformReport = async () => {
  const [totalUsers, totalEvents, pendingEvents] = await Promise.all([
    User.countDocuments(),
    Event.countDocuments(),
    Event.countDocuments({ approvalStatus: "pending" }),
  ]);

  const tickets = await TicketCollection.find({ paymentStatus: "paid" });

  const totalRevenue = tickets.reduce(
    (acc, ticket) => acc + (ticket.totalAmount || 0),
    0,
  );

  return {
    totalUsers,
    totalEvents,
    pendingEvents,
    totalRevenue,
    totalTicketsSold: tickets.length,
    generatedAt: new Date().toISOString(),
  };
};

/**
 * ----------------------------------------
 * EXPORT REPORT CONTROLLER
 * ----------------------------------------
 */
export const exportReports = async (req, res) => {
  try {
    const { format = "csv" } = req.query;

    const report = await buildPlatformReport();

    const reportData = [report];

    /**
     * ========================================
     * CSV EXPORT
     * ========================================
     */
    if (format === "csv") {
      const parser = new Parser();

      const csv = parser.parse(reportData);

      res.header("Content-Type", "text/csv");
      res.attachment("movent-platform-report.csv");

      return res.status(httpStatus.OK).send(csv);
    }

    /**
     * ========================================
     * XLSX EXPORT (EXCEL)
     * ========================================
     */
    if (format === "xlsx") {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Platform Report");

      worksheet.columns = [
        { header: "Total Users", key: "totalUsers", width: 18 },
        { header: "Total Events", key: "totalEvents", width: 18 },
        { header: "Pending Events", key: "pendingEvents", width: 18 },
        { header: "Total Revenue", key: "totalRevenue", width: 18 },
        { header: "Tickets Sold", key: "totalTicketsSold", width: 18 },
        { header: "Generated At", key: "generatedAt", width: 30 },
      ];

      worksheet.addRows(reportData);

      // Style header row
      worksheet.getRow(1).font = { bold: true };

      worksheet.getRow(1).alignment = {
        vertical: "middle",
        horizontal: "center",
      };

      worksheet.eachRow((row) => {
        row.alignment = { vertical: "middle" };
      });

      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      );

      res.setHeader(
        "Content-Disposition",
        "attachment; filename=movent-platform-report.xlsx",
      );

      await workbook.xlsx.write(res);
      return res.end();
    }

    /**
     * ========================================
     * PDF EXPORT (PREMIUM LOOK)
     * ========================================
     */
    if (format === "pdf") {
      const doc = new PDFDocument({
        margin: 50,
        size: "A4",
      });

      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        "attachment; filename=movent-platform-report.pdf",
      );

      doc.pipe(res);

      // HEADER
      doc
        .fontSize(22)
        .fillColor("#004d4d")
        .text("Movent Platform Report", { align: "center" });

      doc.moveDown(2);

      // SECTION TITLE
      doc.fontSize(14).fillColor("black").text("Summary Overview");

      doc.moveDown(1);

      // DATA
      doc.fontSize(12);

      doc.text(`👤 Total Users: ${report.totalUsers}`);
      doc.text(`🎪 Total Events: ${report.totalEvents}`);
      doc.text(`⏳ Pending Events: ${report.pendingEvents}`);
      doc.text(`💰 Total Revenue: ₦${report.totalRevenue.toLocaleString()}`);
      doc.text(`🎟️ Tickets Sold: ${report.totalTicketsSold}`);

      doc.moveDown(2);

      // FOOTER
      doc
        .fontSize(10)
        .fillColor("gray")
        .text(
          `Generated At: ${new Date(report.generatedAt).toLocaleString()}`,
          {
            align: "right",
          },
        );

      doc.end();
      return;
    }

    /**
     * ========================================
     * INVALID FORMAT
     * ========================================
     */
    return errorResponse(res, {
      statusCode: httpStatus.BAD_REQUEST,
      message: "Invalid export format. Use csv | xlsx | pdf",
    });
  } catch (error) {
    return errorResponse(res, {
      statusCode: httpStatus.INTERNAL_SERVER_ERROR,
      message: "Error exporting reports",
      error: error.message,
    });
  }
};
