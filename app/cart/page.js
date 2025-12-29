"use client";
import Navbar from "@/components/Navbar";
import { useCart } from "@/context/CartContext";
import Link from "next/link";


export default function CartPage() {
  const { cartItems, removeFromCart, updateQuantity } = useCart();

  const total = cartItems.reduce(
    (sum, item) => sum + item.quantity * parseInt(item.price.replace("₹", "")),
    0
  );

  return (
    <>
      <Navbar />

      <main className="max-w-5xl mx-auto px-8 py-20">
        <h1 className="text-4xl mb-10">Your Cart</h1>

        {cartItems.length === 0 ? (
          <p className="text-gray-500">Your cart is empty.</p>
        ) : (
          <>
            <div className="space-y-6">
              {cartItems.map((item) => (
                <div
                  key={item.slug}
                  className="flex items-center justify-between bg-white p-6 rounded-xl shadow-sm"
                >
                  <div>
                    <h3 className="font-medium">{item.name}</h3>
                    <p className="text-gold font-semibold">{item.price}</p>
                  </div>

                  <div className="flex items-center gap-4">
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) =>
                        updateQuantity(item.slug, Number(e.target.value))
                      }
                      className="w-16 border rounded px-2 py-1"
                    />

                    <button
                      onClick={() => removeFromCart(item.slug)}
                      className="text-sm text-red-500"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-10 flex justify-between items-center">
              <h2 className="text-xl font-semibold">
                Total: ₹{total}
              </h2>

              <Link href="/checkout">
                <button className="bg-gold text-white px-8 py-3 rounded-full shadow-md">
                  Proceed to Checkout
                </button>
              </Link>

            </div>
          </>
        )}
      </main>
    </>
  );
}
