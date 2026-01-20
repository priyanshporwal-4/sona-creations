import connectDB from "@/lib/db";
import Order from "@/models/Order";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const rawBody = await req.text();

    // ✅ If body is empty, just acknowledge
    if (!rawBody || rawBody.trim() === "") {
      console.warn("⚠️ Shiprocket webhook: empty body");
      return NextResponse.json({ success: true });
    }

    let payload;
    try {
      payload = JSON.parse(rawBody);
    } catch (err) {
      console.warn("⚠️ Shiprocket webhook: non-JSON payload");
      return NextResponse.json({ success: true });
    }

    console.log("📦 Shiprocket Webhook Payload:", payload);

    const { order_id, current_status } = payload;

    if (!order_id || !current_status) {
      return NextResponse.json({ success: true });
    }

    await connectDB();

    const order = await Order.findById(order_id);
    if (!order) {
      console.warn("⚠️ Order not found for webhook:", order_id);
      return NextResponse.json({ success: true });
    }

    // 🔁 STATUS MAPPING
    const status = current_status.toUpperCase();

    if (
      ["PICKUP GENERATED", "PICKUP SCHEDULED", "IN TRANSIT"].includes(status)
    ) {
      order.status = "shipped";
    }

    if (status === "DELIVERED") {
      order.status = "delivered";
    }

    if (
      ["CANCELLED", "RTO INITIATED", "RTO DELIVERED"].includes(status)
    ) {
      order.status = "cancelled";
    }

    order.shipment = {
      awb: payload.awb,
      courier: payload.courier_name,
      trackingUrl: payload.tracking_url,
      lastStatus: current_status,
    };

    await order.save();

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("❌ Shiprocket Webhook Fatal Error:", err);
    // Even on error, ACK to prevent retries storm
    return NextResponse.json({ success: true });
  }
}
