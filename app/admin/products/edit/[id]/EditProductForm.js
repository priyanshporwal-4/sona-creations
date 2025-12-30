"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function EditProductForm({ productId }) {
  const router = useRouter();

  const [form, setForm] = useState(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  /* ---------------- FETCH PRODUCT ---------------- */
  useEffect(() => {
    async function fetchProduct() {
      const res = await fetch(`/api/admin/products/${productId}`);
      const data = await res.json();
      setForm(data);
    }
    fetchProduct();
  }, [productId]);

  if (!form) return <p>Loading...</p>;

  /* ---------------- IMAGE UPLOAD ---------------- */
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();

    setForm((prev) => ({
      ...prev,
      images: [...(prev.images || []), data.url],
    }));

    setUploading(false);
  };

  /* ---------------- REMOVE IMAGE ---------------- */
  const removeImage = (url) => {
    setForm((prev) => ({
      ...prev,
      images: prev.images.filter((img) => img !== url),
    }));
  };

  /* ---------------- SUBMIT ---------------- */
  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);

    await fetch(`/api/admin/products/${productId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.name,
        price: Number(form.price),
        stock: Number(form.stock),
        images: form.images,
      }),
    });

    setSaving(false);
    router.push("/admin/products");
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-xl space-y-4">
      <h1 className="text-2xl font-semibold">Edit Product</h1>

      {/* NAME */}
      <input
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
        className="w-full border p-3 rounded"
        placeholder="Product Name"
        required
      />

      {/* PRICE */}
      <input
        type="number"
        value={form.price}
        onChange={(e) =>
          setForm({ ...form, price: Number(e.target.value) })
        }
        className="w-full border p-3 rounded"
        placeholder="Price"
        required
      />

      {/* STOCK */}
      <input
        type="number"
        value={form.stock || 0}
        onChange={(e) =>
          setForm({ ...form, stock: Number(e.target.value) })
        }
        className="w-full border p-3 rounded"
        placeholder="Stock"
        required
      />

      {/* IMAGES */}
      <div>
        <p className="font-medium mb-2">Images</p>

        <div className="flex gap-3 flex-wrap">
          {form.images?.map((img) => (
            <div key={img} className="relative">
              <img
                src={img}
                className="w-24 h-24 object-cover rounded"
              />
              <button
                type="button"
                onClick={() => removeImage(img)}
                className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full px-2"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* UPLOAD IMAGE */}
      <input
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
      />

      {/* SAVE */}
      <button
        disabled={saving || uploading}
        className="bg-gold text-white px-6 py-3 rounded"
      >
        {saving ? "Saving..." : "Update"}
      </button>
    </form>
  );
}
