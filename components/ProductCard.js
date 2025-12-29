import Image from "next/image";
import Link from "next/link";

export default function ProductCard({ product }) {
  return (
    <Link href={`/product/${product.slug}`}>
      <div className="border rounded-xl overflow-hidden hover:shadow-lg transition">
        <div className="relative w-full h-64 bg-gray-100">
          <Image
            src={product.images?.[0] || "/placeholder.png"}
            alt={product.name}
            fill
            className="object-cover"
          />
        </div>

        <div className="p-4">
          <h3 className="font-medium text-lg">
            {product.name}
          </h3>
          <p className="text-sm text-gray-500">
            {product.category}
          </p>
          <p className="font-semibold text-lg">
            ₹{product.price}
          </p>
        </div>
      </div>
    </Link>
  );
}
