"use client";

import Script from "next/script";
import Navbar from "@/components/Navbar";
import { useCart } from "@/context/CartContext";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function CheckoutPage() {
  const { cartItems } = useCart();
  const router = useRouter();

  // CUSTOMER INFO
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [pincode, setPincode] = useState("");

  const total = cartItems.reduce(
    (sum, item) => sum + item.quantity * Number(item.price),
    0
  );

  async function handlePayment() {
    if (!name || !email || !phone || !address) {
      alert("Please fill all address details");
      return;
    }

    // 1️⃣ CREATE RAZORPAY ORDER
    const res = await fetch("/api/razorpay/order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: total }),
    });

    const order = await res.json();

    // 2️⃣ RAZORPAY OPTIONS
    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: "INR",
      name: "Sona Creations",
      description: "Order Payment",
      order_id: order.id,

      handler: async function (response) {
        // 3️⃣ VERIFY PAYMENT
        const verifyRes = await fetch("/api/razorpay/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            orderData: {
              items: cartItems,
              total,
              customer: {
                name,
                email,
                phone,
                address,
                city,
                state,
                pincode,
              },
            },
          }),
        });

        const result = await verifyRes.json();

        if (result.success) {
          router.push(`/order/success?orderId=${result.order._id}`);
        } else {
          alert("Payment verification failed");
        }
      },

      theme: {
        color: "#C6A75E",
      },
    };

    const razorpay = new window.Razorpay(options);
    razorpay.open();
  }

  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />
      <Navbar />

      <main className="max-w-6xl mx-auto px-8 py-20 grid grid-cols-1 md:grid-cols-2 gap-16">
        {/* LEFT: ADDRESS */}
        <div>
          <h1 className="text-3xl mb-6">Checkout</h1>

          <div className="space-y-4">
            <input
              className="w-full border p-3 rounded"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />

            <input
              type="email"
              className="w-full border p-3 rounded"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <input
              type="tel"
              className="w-full border p-3 rounded"
              placeholder="Phone Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />

            <textarea
              className="w-full border p-3 rounded"
              placeholder="Full Address (House no, Area, Landmark)"
              rows={3}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
            />

            <div className="grid grid-cols-2 gap-4">
              <input
                className="w-full border p-3 rounded"
                placeholder="City"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                required
              />

              <input
                className="w-full border p-3 rounded"
                placeholder="State"
                value={state}
                onChange={(e) => setState(e.target.value)}
                required
              />
            </div>

            <input
              type="number"
              className="w-full border p-3 rounded"
              placeholder="Pincode"
              value={pincode}
              onChange={(e) => setPincode(e.target.value)}
              required
            />
          </div>
        </div>
        {/* RIGHT: SUMMARY */}
        <div className="bg-white rounded-xl p-8 shadow-sm">
          <h2 className="text-2xl mb-6">Order Summary</h2>

          <div className="space-y-4 mb-6">
            {cartItems.map((item) => (
              <div key={item.slug} className="flex justify-between text-sm">
                <span>
                  {item.name} × {item.quantity}
                </span>
                <span>₹{item.quantity * Number(item.price)}</span>
              </div>
            ))}
          </div>

          <div className="flex justify-between font-semibold text-lg mb-6">
            <span>Total</span>
            <span>₹{total}</span>
          </div>

          <button
            onClick={handlePayment}
            className="w-full bg-gold text-white py-4 rounded-full"
          >
            PAY ₹{total}
          </button>
        </div>
      </main>
    </>
  );
}
