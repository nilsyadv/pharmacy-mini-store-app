import PDFDocument from "pdfkit";
import type { Sale } from "@shared/schema";
import { storage } from "./storage";

export async function generateInvoicePDF(saleId: string): Promise<Buffer> {
  const sale = await storage.getSale(saleId);
  if (!sale) {
    throw new Error("Sale not found");
  }

  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 50 });
    const buffers: Buffer[] = [];

    doc.on("data", buffers.push.bind(buffers));
    doc.on("end", () => resolve(Buffer.concat(buffers)));
    doc.on("error", reject);

    // Header
    doc.fontSize(20).text("INVOICE", { align: "center" });
    doc.moveDown();

    // Invoice details
    doc.fontSize(12);
    doc.text(`Invoice ID: ${sale.id}`);
    doc.text(`Date: ${sale.created_at ? new Date(sale.created_at).toLocaleDateString() : 'N/A'}`);
    doc.text(`Customer: ${sale.customer_name || 'Walk-in Customer'}`);
    doc.moveDown();

    // Items table header
    doc.fontSize(10).fillColor("#444");
    const tableTop = doc.y;
    doc.text("Item", 50, tableTop);
    doc.text("Quantity", 300, tableTop);
    doc.text("Price", 400, tableTop);
    doc.text("Total", 480, tableTop, { align: "right" });
    
    doc.moveTo(50, tableTop + 15).lineTo(550, tableTop + 15).stroke();
    doc.moveDown();

    // Items
    let y = doc.y;
    sale.items.forEach((item) => {
      doc.fillColor("#000");
      doc.text(item.name, 50, y);
      doc.text(item.quantity.toString(), 300, y);
      doc.text(`$${item.price.toFixed(2)}`, 400, y);
      doc.text(`$${(item.quantity * item.price).toFixed(2)}`, 480, y, { align: "right" });
      y += 20;
    });

    // Total
    doc.moveDown();
    doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
    doc.moveDown();
    doc.fontSize(14).fillColor("#000");
    doc.text(`Total Amount: $${sale.total_amount.toFixed(2)}`, { align: "right" });

    // Footer
    doc.moveDown(2);
    doc.fontSize(10).fillColor("#666");
    doc.text("Thank you for your business!", { align: "center" });

    doc.end();
  });
}

export async function generateSalesReportPDF(
  startDate: Date,
  endDate: Date,
  reportType: 'daily' | 'monthly'
): Promise<Buffer> {
  const sales = await storage.getSalesByDateRange(startDate, endDate);

  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 50 });
    const buffers: Buffer[] = [];

    doc.on("data", buffers.push.bind(buffers));
    doc.on("end", () => resolve(Buffer.concat(buffers)));
    doc.on("error", reject);

    // Header
    doc.fontSize(20).text("SALES REPORT", { align: "center" });
    doc.moveDown();

    // Report details
    doc.fontSize(12);
    doc.text(`Report Type: ${reportType.charAt(0).toUpperCase() + reportType.slice(1)}`);
    doc.text(`Period: ${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`);
    doc.text(`Total Sales: ${sales.length}`);
    doc.moveDown();

    // Calculate totals
    const totalRevenue = sales.reduce((sum, sale) => sum + sale.total_amount, 0);
    doc.fontSize(14);
    doc.text(`Total Revenue: $${totalRevenue.toFixed(2)}`);
    doc.moveDown();

    // Sales table header
    doc.fontSize(10).fillColor("#444");
    const tableTop = doc.y;
    doc.text("Date", 50, tableTop);
    doc.text("Customer", 150, tableTop);
    doc.text("Items", 300, tableTop);
    doc.text("Amount", 480, tableTop, { align: "right" });
    
    doc.moveTo(50, tableTop + 15).lineTo(550, tableTop + 15).stroke();
    doc.moveDown();

    // Sales data
    let y = doc.y;
    sales.forEach((sale) => {
      if (y > 700) {
        doc.addPage();
        y = 50;
      }

      doc.fillColor("#000");
      const date = sale.created_at ? new Date(sale.created_at).toLocaleDateString() : 'N/A';
      doc.text(date, 50, y, { width: 100 });
      doc.text(sale.customer_name || 'Walk-in', 150, y, { width: 140 });
      doc.text(sale.items.length.toString(), 300, y);
      doc.text(`$${sale.total_amount.toFixed(2)}`, 480, y, { align: "right" });
      y += 25;
    });

    doc.end();
  });
}
