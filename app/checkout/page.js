"use client";

import Script from "next/script";
import Navbar from "@/components/Navbar";
import { useCart } from "@/context/CartContext";

export default function CheckoutPage() {
  const { cartItems } = useCart();

  // ✅ Correct total calculation
  const total = cartItems.reduce(
    (sum, item) => sum + item.quantity * item.price,
    0
  );

  const handlePayment = async () => {
    const res = await fetch("/api/razorpay", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: total }),
    });

    const order = await res.json();

    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: "INR",
      name: "Sona Creations",
      description: "Order Payment",
      order_id: order.id,
      handler: function (response) {
        alert("Payment successful!");
        console.log(response);
      },
      theme: {
        color: "#C6A75E",
      },
    };

    const razorpay = new window.Razorpay(options);
    razorpay.open();
  };

  return (
    <>
      {/* Razorpay Script */}
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />

      <Navbar />

      <main className="max-w-6xl mx-auto px-8 py-20 grid grid-cols-1 md:grid-cols-2 gap-16">
        {/* LEFT: ADDRESS FORM */}
        <div>
          <h1 className="text-3xl mb-6">Checkout</h1>

          <form className="space-y-4">
            <input
              type="text"
              placeholder="Full Name"
              className="w-full border rounded-md px-4 py-3"
            />

            <input
              type="email"
              placeholder="Email Address"
              className="w-full border rounded-md px-4 py-3"
            />

            <input
              type="text"
              placeholder="Phone Number"
              className="w-full border rounded-md px-4 py-3"
            />

            <input
              type="text"
              placeholder="Address"
              className="w-full border rounded-md px-4 py-3"
            />

            <input
              type="text"
              placeholder="City"
              className="w-full border rounded-md px-4 py-3"
            />

            <input
              type="text"
              placeholder="Pincode"
              className="w-full border rounded-md px-4 py-3"
            />
          </form>
        </div>

        {/* RIGHT: ORDER SUMMARY */}
        <div className="bg-white rounded-xl p-8 shadow-sm">
          <h2 className="text-2xl mb-6">Order Summary</h2>

          <div className="space-y-4 mb-6">
            {cartItems.map((item) => (
              <div
                key={item.slug}
                className="flex justify-between text-sm"
              >
                <span>
                  {item.name} × {item.quantity}
                </span>
                <span>
                  ₹{item.quantity * item.price}
                </span>
              </div>
            ))}
          </div>

          <div className="flex justify-between font-semibold text-lg mb-6">
            <span>Total</span>
            <span>₹{total}</span>
          </div>

          <button
            onClick={handlePayment}
            className="w-full bg-gold text-white py-4 rounded-full shadow-md hover:opacity-90 transition"
          >
            PAY ₹{total}
          </button>
        </div>
      </main>
    </>
  );
}
