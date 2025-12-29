import Link from "next/link";
import Navbar from "@/components/Navbar";

async function getProducts() {
  const res = await fetch("http://localhost:3000/api/products", {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch products");
  }

  return res.json();
}

export default async function ShopPage() {
  const products = await getProducts();

  return (
    <>
      <Navbar />

      <main className="max-w-7xl mx-auto px-8 py-20">
        <h1 className="text-4xl mb-10">Shop</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
          {products.map((product) => (
            <Link
              key={product._id}
              href={`/product/${product.slug}`}
              className="border rounded-xl p-6 hover:shadow-lg transition"
            >
              <h3 className="text-lg font-medium mb-2">
                {product.name}
              </h3>

              <p className="text-sm text-gray-500 mb-4">
                {product.category}
              </p>

              <p className="font-semibold text-lg">
                ₹{product.price}
              </p>
            </Link>
          ))}
        </div>
      </main>
    </>
  );
}
