import connectDB from "@/lib/db";
import Product from "@/models/Product";
import Link from "next/link";
import DeleteButton from "./DeleteButton";

export const revalidate = 0;

export default async function AdminProductsPage() {
  await connectDB();

  const products = await Product.find({})
    .sort({ createdAt: -1 })
    .lean();

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-semibold">Products</h1>

        <Link
          href="/admin/products/new"
          className="bg-gold text-white px-6 py-2 rounded-full"
        >
          + Add Product
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-4">Name</th>
              <th className="p-4">Category</th>
              <th className="p-4">Price</th>
              <th className="p-4">Stock</th>
              <th className="p-4">Status</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>

          <tbody>
            {products.map((p) => (
              <tr key={p._id.toString()} className="border-t">
                <td className="p-4">{p.name}</td>
                <td className="p-4">{p.category}</td>
                <td className="p-4">₹{p.price}</td>
                <td className="p-4">{p.stock}</td>
                <td className="p-4">
                  {p.isActive ? "Active" : "Inactive"}
                </td>
                <td className="p-4 space-x-3">
                  <Link
                    href={`/admin/products/edit/${p._id}`}
                    className="text-blue-600 hover:underline"
                  >
                    Edit
                  </Link>

                  <DeleteButton productId={p._id.toString()} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
