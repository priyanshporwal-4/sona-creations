import Navbar from "@/components/Navbar";
import Link from "next/link";

const products = [
  {
    id: 1,
    slug: "elegant-kurta-set",
    name: "Elegant Kurta Set",
    category: "Women Ethnic",
    price: "₹2,499",
  },
  {
    id: 2,
    slug: "festive-anarkali",
    name: "Festive Anarkali",
    category: "Women Ethnic",
    price: "₹3,199",
  },
  {
    id: 3,
    slug: "classic-cotton-kurta",
    name: "Classic Cotton Kurta",
    category: "Daily Wear",
    price: "₹1,899",
  },
  {
    id: 4,
    slug: "designer-kurta-set",
    name: "Designer Kurta Set",
    category: "Occasion Wear",
    price: "₹3,999",
  },
];

export default function ShopPage() {
  return (
    <>
      <Navbar />

      <main className="max-w-7xl mx-auto px-8 py-20">
        <h1 className="text-4xl mb-12 text-center">
          Shop Collection
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
          {products.map((product) => (
            <Link
              key={product.id}
              href={`/product/${product.slug}`}
              className="block"
            >
              <div className="bg-white rounded-xl p-4 shadow-sm hover:shadow-xl transition cursor-pointer">
                <div className="h-64 bg-gray-100 rounded-lg mb-4"></div>

                <h3 className="font-medium mb-1">
                  {product.name}
                </h3>

                <p className="text-sm text-gray-500 mb-2">
                  {product.category}
                </p>

                <p className="font-semibold text-gold">
                  {product.price}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </>
  );
}
