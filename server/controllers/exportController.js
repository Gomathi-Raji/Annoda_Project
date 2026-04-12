import ExcelJS from "exceljs";
import { Parser } from "json2csv";
import PDFDocument from "pdfkit";
import Order from "../models/Order.js";

const getExportRows = async () => {
  const orders = await Order.find().sort({ createdAt: -1 }).lean();

  return orders.map((order) => ({
    "Order ID": order.orderId || "",
    Name: order.customerName || "",
    Phone: order.phone || "",
    Product: order.product?.type || "",
    Size: order.product?.size || "",
    Color: order.product?.color || "",
    Status: order.status || "",
    Date: order.createdAt ? new Date(order.createdAt).toISOString() : ""
  }));
};

export const exportOrdersCsv = async (_req, res, next) => {
  try {
    const rows = await getExportRows();
    const parser = new Parser({
      fields: ["Order ID", "Name", "Phone", "Product", "Size", "Color", "Status", "Date"]
    });
    const csv = parser.parse(rows);

    res.setHeader("Content-Type", "text/csv; charset=utf-8");
    res.setHeader("Content-Disposition", "attachment; filename=orders.csv");
    res.status(200).send(csv);
  } catch (error) {
    next(error);
  }
};

export const exportOrdersExcel = async (_req, res, next) => {
  try {
    const rows = await getExportRows();
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Orders");

    worksheet.columns = [
      { header: "Order ID", key: "Order ID", width: 16 },
      { header: "Name", key: "Name", width: 24 },
      { header: "Phone", key: "Phone", width: 16 },
      { header: "Product", key: "Product", width: 16 },
      { header: "Size", key: "Size", width: 10 },
      { header: "Color", key: "Color", width: 14 },
      { header: "Status", key: "Status", width: 14 },
      { header: "Date", key: "Date", width: 28 }
    ];

    rows.forEach((row) => worksheet.addRow(row));

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader("Content-Disposition", "attachment; filename=orders.xlsx");

    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    next(error);
  }
};

export const exportOrdersPdf = async (_req, res, next) => {
  try {
    const rows = await getExportRows();

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=orders.pdf");

    const doc = new PDFDocument({ margin: 30, size: "A4" });
    doc.pipe(res);

    doc.fontSize(16).text("Kase Brothers - Orders Export", { align: "center" });
    doc.moveDown();

    rows.forEach((row, index) => {
      doc
        .fontSize(10)
        .text(
          `${index + 1}. ${row["Order ID"]} | ${row.Name} | ${row.Phone} | ${row.Product} | ${row.Size} | ${row.Color} | ${row.Status} | ${row.Date}`
        );
      doc.moveDown(0.5);
    });

    doc.end();
  } catch (error) {
    next(error);
  }
};