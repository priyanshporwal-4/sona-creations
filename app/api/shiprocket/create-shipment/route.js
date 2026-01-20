import connectDB from "@/lib/db";
import Order from "@/models/Order";
import { getShiprocketToken } from "@/lib/shiprocket";
import { sendEmail } from "@/lib/email";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { orderId } = await req.json();

    await connectDB();

    const order = await Order.findById(orderId);
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // 🛑 HARD STOP: prevent duplicate shipment
    if (order.shipment?.awb) {
      return NextResponse.json(
        { error: "Shipment already created for this order" },
        { status: 400 }
      );
    }

    // 🧠 Split customer name safely
    const fullName = order.customer?.name || "";
    const [firstName, ...rest] = fullName.split(" ");
    const lastName = rest.join(" ") || "NA";

    // 🏠 Normalize address
    const address =
      typeof order.customer.address === "string"
        ? {
            line1: order.customer.address,
            city: "NA",
            state: "NA",
            pincode: "000000",
          }
        : order.customer.address;

    // 📦 REQUIRED package details (Shiprocket mandatory)
    const length = 20;   // cm
    const breadth = 15;  // cm
    const height = 10;   // cm
    const weight = 0.5;  // kg

    // 🔐 Shiprocket token
    const token = await getShiprocketToken();

    // 🚚 Shiprocket payload
    const payload = {
      order_id: order._id.toString(),
      order_date: new Date().toISOString().split("T")[0],
      channel_id: Number(process.env.SHIPROCKET_CHANNEL_ID),

      billing_customer_name: firstName,
      billing_last_name: lastName,
      billing_phone: order.customer.phone,
      billing_email: order.customer.email,
      billing_address: address.line1,
      billing_city: address.city,
      billing_state: address.state,
      billing_pincode: String(address.pincode).padStart(6, "0"),
      billing_country: "India",

      shipping_is_billing: true,
      payment_method: "Prepaid",
      sub_total: Number(order.total),

      length,
      breadth,
      height,
      weight,

      order_items: order.items.map((item) => ({
        name: item.name,
        sku: item.slug || item.name.replace(/\s+/g, "-").toLowerCase(),
        units: Number(item.quantity),
        selling_price: Number(item.price),
      })),
    };

    const res = await fetch(
      "https://apiv2.shiprocket.in/v1/external/orders/create/adhoc",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    );

    const data = await res.json();

    if (!res.ok) {
      console.error("Shiprocket API error:", data);
      return NextResponse.json(
        { error: "Shiprocket order failed", details: data },
        { status: 400 }
      );
    }

    // ✅ SAVE SHIPMENT DETAILS
    order.shipment = {
      shipmentId: data.shipment_id,
      awb: data.awb_code,
      courier: data.courier_name,
      trackingUrl: data.tracking_url,
      lastStatus: "processing",
    };


    // ✅ VALID ENUM STATUS
    order.status = "processing";

    await order.save();

    const trackingPageUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/order/track/${order._id}`;

    try{
        await sendEmail({
            to: order.customer.email,
            subject: "Your Order Has Been Shipped 🚚",
            html: `
                <h2>Your order is on the way!</h2>

                <p><b>Courier:</b> ${order.shipment.courier}</p>
                <p><b>AWB:</b> ${order.shipment.awb}</p>

                <p>
                <a href="${trackingPageUrl}">
                    Track your shipment
                </a>
                </p>

                <br />
                <p>Thank you for shopping with Sona Creations.</p>
            `,
            });
        } catch (emailErr) {
            console.error("Email failed:", emailErr);
        }

    return NextResponse.json({ success: true, data });
  } catch (err) {
    console.error("Shiprocket error:", err);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
