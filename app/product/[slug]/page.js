import Navbar from "@/components/Navbar";
import ProductClient from "./ProductClient";

export default async function ProductDetail({ params }) {
  const { slug } = await params;

  // Temporary static product (later from DB)
  const product = {
    slug,
    name: "Elegant Kurta Set",
    category: "Women Ethnic",
    price: "₹2,499",
    description:
      "Premium handcrafted kurta set designed with elegance, comfort, and timeless style.",
    sizes: ["S", "M", "L", "XL"],
  };

  return (
    <>
      <Navbar />
      <ProductClient product={product} />
    </>
  );
}
