"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";

export default function ProductActions({ productId }) {
  const router = useRouter();

  const handleDelete = async () => {
    const ok = confirm("Are you sure you want to delete this product?");
    if (!ok) return;

    await fetch(`/api/admin/products/${productId}`, {
      method: "DELETE",
    });

    router.refresh(); // re-fetch server data
  };

  return (
    <div className="space-x-3">
      <Link
        href={`/admin/products/edit/${productId}`}
        className="text-blue-600 hover:underline"
      >
        Edit
      </Link>

      <button
        onClick={handleDelete}
        className="text-red-600 hover:underline"
      >
        Delete
      </button>
    </div>
  );
}
