import Navbar from "@/components/Navbar";
import AddToCartButton from "@/components/AddToCartButton";
import connectDB from "@/lib/db";
import Product from "@/models/Product";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

async function getProduct(slug) {
  await connectDB();

  const product = await Product.findOne({
    slug: { $regex: `^${slug}$`, $options: "i" },
    isActive: true,
  }).lean();

  if (!product) return null;

  return JSON.parse(JSON.stringify(product));
}

export default async function ProductDetail(props) {
  const params = await props.params;
  const product = await getProduct(params.slug);

  if (!product) {
    notFound();
  }

  return (
    <>
      <Navbar />

      <main className="max-w-5xl mx-auto px-8 py-20 grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="bg-gray-100 rounded-xl h-96" />

        <div>
          <h1 className="text-3xl font-semibold mb-4">
            {product.name}
          </h1>

          <p className="text-gray-600 mb-6">
            {product.description}
          </p>

          <p className="text-2xl font-bold mb-6">
            ₹{product.price}
          </p>

          <AddToCartButton product={product} />
        </div>
      </main>
    </>
  );
}
