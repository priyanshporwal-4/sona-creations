"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewProductPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    description: "",
    category: "",
    price: "",
    stock: "",
    image: null,
  });

  const [uploading, setUploading] = useState(false);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm({
      ...form,
      [name]: files ? files[0] : value,
    });
  };

  const generateSlug = (name) =>
    name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");

  const uploadImage = async () => {
    const data = new FormData();
    data.append("file", form.image);

    const res = await fetch("/api/upload", {
      method: "POST",
      body: data,
    });

    const result = await res.json();
    return result.url;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);

    const imageUrl = await uploadImage();

    const payload = {
      name: form.name,
      description: form.description,
      category: form.category,
      price: Number(form.price),
      stock: Number(form.stock),
      slug: generateSlug(form.name),
      images: [imageUrl],
    };

    await fetch("/api/admin/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    setUploading(false);
    router.push("/admin/products");
  };

  return (
    <div className="max-w-2xl">
      <h1 className="text-3xl font-semibold mb-6">
        Add New Product
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="name"
          placeholder="Product Name"
          className="w-full border px-4 py-3 rounded"
          onChange={handleChange}
          required
        />

        <textarea
          name="description"
          placeholder="Description"
          className="w-full border px-4 py-3 rounded"
          onChange={handleChange}
          required
        />

        <input
          name="category"
          placeholder="Category"
          className="w-full border px-4 py-3 rounded"
          onChange={handleChange}
          required
        />

        <input
          name="price"
          type="number"
          placeholder="Price (₹)"
          className="w-full border px-4 py-3 rounded"
          onChange={handleChange}
          required
        />

        <input
          name="stock"
          type="number"
          placeholder="Stock"
          className="w-full border px-4 py-3 rounded"
          onChange={handleChange}
          required
        />

        <input
          name="image"
          type="file"
          accept="image/*"
          className="w-full"
          onChange={handleChange}
          required
        />

        <button
          type="submit"
          disabled={uploading}
          className="bg-gold text-white px-8 py-3 rounded-full"
        >
          {uploading ? "Uploading..." : "Save Product"}
        </button>
      </form>
    </div>
  );
}
