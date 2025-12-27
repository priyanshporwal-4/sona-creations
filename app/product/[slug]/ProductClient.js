"use client";

import { useCart } from "@/context/CartContext";

export default function ProductClient({ product }) {
  const { addToCart } = useCart();

  return (
    <main className="max-w-6xl mx-auto px-8 py-20 grid grid-cols-1 md:grid-cols-2 gap-16">
      {/* IMAGE */}
      <div className="h-[500px] bg-gray-100 rounded-xl"></div>

      {/* DETAILS */}
      <div>
        <h1 className="text-4xl mb-4">{product.name}</h1>
        <p className="text-gray-500 mb-2">{product.category}</p>

        <p className="text-2xl font-semibold text-gold mb-6">
          {product.price}
        </p>

        <p className="text-gray-600 mb-8">
          {product.description}
        </p>

        {/* SIZES */}
        <div className="mb-8">
          <p className="mb-2 font-medium">Select Size</p>
          <div className="flex gap-3">
            {product.sizes.map((size) => (
              <button
                key={size}
                className="border border-gray-300 px-4 py-2 rounded-md hover:border-gold hover:text-gold transition"
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={() => addToCart(product)}
          className="bg-gold text-white px-10 py-4 rounded-full shadow-md hover:scale-105 transition"
        >
          ADD TO CART
        </button>
      </div>
    </main>
  );
}
