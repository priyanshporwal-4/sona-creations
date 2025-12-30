"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AddProductPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    price: "",
    stock: "",
    images: [], // ✅ Cloudinary URLs
  });

  const [uploading, setUploading] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);

  // -------------------------
  // Handle text inputs
  // -------------------------
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // -------------------------
  // Generate slug
  // -------------------------
  const generateSlug = (name) =>
    name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");

  // -------------------------
  // Upload image to Cloudinary
  // -------------------------
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImageUploading(true);

    const data = new FormData();
    data.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: data,
      });

      const result = await res.json();

      if (!res.ok) {
        alert(result.error || "Image upload failed");
        setImageUploading(false);
        return;
      }

      // ✅ Save Cloudinary URL
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, result.url],
      }));
    } catch (err) {
      console.error(err);
      alert("Image upload error");
    }

    setImageUploading(false);
  };

  // -------------------------
  // Submit product
  // -------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);

    const payload = {
      name: formData.name,
      description: formData.description,
      category: formData.category,
      price: Number(formData.price),
      stock: Number(formData.stock),
      slug: generateSlug(formData.name),
      images: formData.images,
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

        {/* Image upload */}
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
        />

        {/* Image preview */}
        {formData.images.length > 0 && (
          <div className="flex gap-4 mt-4">
            {formData.images.map((img, i) => (
              <img
                key={i}
                src={img}
                alt="Uploaded"
                className="w-24 h-24 object-cover rounded border"
              />
            ))}
          </div>
        )}

        <button
          type="submit"
          disabled={uploading || imageUploading}
          className="bg-gold text-white px-8 py-3 rounded-full"
        >
          {uploading ? "Saving..." : "Save Product"}
        </button>
      </form>
    </div>
  );
}
