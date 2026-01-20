"use client";

export default function DeleteButton({ productId }) {
  async function handleDelete() {
    if (!confirm("Delete this product?")) return;

    const res = await fetch(`/api/admin/products/${productId}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      alert("Delete failed");
      return;
    }

    window.location.reload();
  }

  return (
    <button onClick={handleDelete} className="text-red-600 hover:underline">
      Delete
    </button>
  );
}
