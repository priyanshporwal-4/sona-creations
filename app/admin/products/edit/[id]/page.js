import EditProductForm from "./EditProductForm";

export default async function EditProductPage({ params }) {
  const { id } = await params; // ✅ FIX

  return <EditProductForm productId={id} />;
}
