import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema(
  {
    items: [
      {
        name: String,
        quantity: Number,
        price: Number,
      },
    ],

    total: {
      type: Number,
      required: true,
    },

    status: {
      type: String,
      enum: ["pending", "processing", "shipped", "delivered", "cancelled"],
      default: "pending",
    },

    customer: {
      name: String,
      email: String,
      phone: String,

      address: {
        line1: String,
        city: String,
        state: String,
        pincode: String,
        country: { type: String, default: "India" },
      },
    },

    payment: {
      razorpayOrderId: String,
      razorpayPaymentId: String,
      status: String,
    },
  },
  { timestamps: true }
);

/**
 * 🚨 IMPORTANT
 * This line prevents model caching bugs
 */
export default mongoose.models.Order || mongoose.model("Order", OrderSchema);
