import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Order from "@/models/Order";

import { PDFDocument, rgb, StandardFonts } from "pdf-lib";

export async function GET(req, { params }) {
  const { id } = await params;

  await connectDB();

  const order = await Order.findById(id).lean();
  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595, 842]); // A4
  const { width, height } = page.getSize();

  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  let y = height - 50;

  // 🏷 BRAND
  page.drawText("SONA CREATIONS", {
    x: 50,
    y,
    size: 20,
    font: boldFont,
  });

  y -= 30;

  page.drawText(`Invoice`, {
    x: 50,
    y,
    size: 14,
    font: boldFont,
  });

  y -= 20;

  // 🧾 ORDER INFO
  page.drawText(`Order ID: ${order._id}`, { x: 50, y, size: 10, font });
  y -= 14;

  page.drawText(
    `Order Date: ${new Date(order.createdAt).toDateString()}`,
    { x: 50, y, size: 10, font }
  );

  y -= 30;

  // 👤 CUSTOMER
  page.drawText("BILL TO:", {
    x: 50,
    y,
    size: 12,
    font: boldFont,
  });

  y -= 14;

  page.drawText(order.customer.name, { x: 50, y, size: 10, font });
  y -= 14;
  page.drawText(order.customer.email, { x: 50, y, size: 10, font });
  y -= 14;
  page.drawText(order.customer.phone, { x: 50, y, size: 10, font });

  y -= 30;

  // 📦 ITEMS HEADER
  page.drawText("Items", {
    x: 50,
    y,
    size: 12,
    font: boldFont,
  });

  y -= 20;

  page.drawText("Product", { x: 50, y, size: 10, font: boldFont });
  page.drawText("Qty", { x: 350, y, size: 10, font: boldFont });
  page.drawText("Price", { x: 420, y, size: 10, font: boldFont });

  y -= 10;

  page.drawLine({
    start: { x: 50, y },
    end: { x: width - 50, y },
    thickness: 1,
    color: rgb(0.8, 0.8, 0.8),
  });

  y -= 15;

  // 📦 ITEMS LOOP
  order.items.forEach((item) => {
    page.drawText(item.name, { x: 50, y, size: 10, font });
    page.drawText(String(item.quantity), { x: 350, y, size: 10, font });
    page.drawText(`Rs. ${item.price}`, { x: 420, y, size: 10, font });
    y -= 15;
  });

  y -= 20;

  // 💰 TOTAL
  page.drawText(`Total Paid: Rs. ${order.total}`, {
    x: 350,
    y,
    size: 12,
    font: boldFont,
  });

  y -= 30;

  page.drawText("Payment Method: Prepaid (Razorpay)", {
    x: 50,
    y,
    size: 10,
    font,
  });

  y -= 40;

  page.drawText("Thank you for shopping with Sona Creations!", {
    x: 50,
    y,
    size: 10,
    font,
  });

  const pdfBytes = await pdfDoc.save();

  return new NextResponse(pdfBytes, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename=invoice-${order._id}.pdf`,
    },
  });
}
