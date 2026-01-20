import Navbar from "@/components/Navbar";
import ProductCard from "@/components/ProductCard";
import { getBaseUrl } from "@/lib/getBaseUrl";


async function getProducts() {
  const res = await fetch(`${getBaseUrl()}/api/products`, {
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
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </main>
    </>
  );
}
