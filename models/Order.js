import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      required: true,
      unique: true,
    },

    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
        },
        name: String,
        price: Number,
        quantity: Number,
        size: String,
      },
    ],

    customer: {
      name: String,
      email: String,
      phone: String,
    },

    address: {
      addressLine: String,
      city: String,
      pincode: String,
      state: String,
    },

    totalAmount: Number,

    payment: {
      method: String, // Razorpay / COD
      razorpayOrderId: String,
      razorpayPaymentId: String,
      razorpaySignature: String,
      status: {
        type: String,
        enum: ["PENDING", "PAID", "FAILED"],
        default: "PENDING",
      },
    },

    shipment: {
      shiprocketOrderId: String,
      awb: String,
      courier: String,
      status: String,
    },

    orderStatus: {
      type: String,
      enum: ["CREATED", "CONFIRMED", "SHIPPED", "DELIVERED", "CANCELLED"],
      default: "CREATED",
    },
  },
  { timestamps: true }
);

export default mongoose.models.Order ||
  mongoose.model("Order", OrderSchema);
