"use client";

import { useCart } from "@/context/CartContext";

export default function AddToCartButton({ product }) {
  const { addToCart } = useCart();

  const handleAdd = () => {
    addToCart({
      _id: product._id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      quantity: 1,
    });
  };

  return (
    <button
      onClick={handleAdd}
      className="bg-gold text-white px-8 py-4 rounded-full shadow-md hover:opacity-90 transition"
    >
      Add to Cart
    </button>
  );
}
