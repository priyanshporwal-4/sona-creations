import crypto from "crypto";
import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Order from "@/models/Order";
import { sendEmail } from "@/lib/email";

export async function POST(req) {
  try {
    const body = await req.json();

    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderData,
    } = body;

    const sign = `${razorpay_order_id}|${razorpay_payment_id}`;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(sign)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return NextResponse.json({ success: false }, { status: 400 });
    }

    await connectDB();

    const order = await Order.create({
      items: orderData.items,
      total: orderData.total,

      customer: {
        name: orderData.customer.name,
        email: orderData.customer.email,
        phone: orderData.customer.phone,
        address: {
          line1: orderData.customer.address,
          city: orderData.customer.city,
          state: orderData.customer.state,
          pincode: orderData.customer.pincode,
          country: "India",
        },
      },

      payment: {
        razorpayOrderId: razorpay_order_id,
        razorpayPaymentId: razorpay_payment_id,
        status: "paid",
      },
    });

    await sendEmail({
      to: order.customer.email,
      subject: "Order Confirmed – Sona Creations",
      html: `
        <h2>Thank you for your order, ${order.customer.name}!</h2>
        <p>Your order has been successfully placed.</p>

        <p><b>Order ID:</b> ${order._id}</p>
        <p><b>Total:</b> ₹${order.total}</p>

        <p>We’ll notify you once your order is shipped.</p>

        <br />
        <p>– Sona Creations</p>
      `,
    });

    return NextResponse.json({
      success: true,
      order: { _id: order._id.toString() },
    });
  } catch (err) {
    console.error("VERIFY ERROR:", err);
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}
