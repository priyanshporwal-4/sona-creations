import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
  name: String,
  slug: { type: String, unique: true, index: true },
  price: Number,
  category: String,
  isActive: { type: Boolean, index: true },
});

export default mongoose.models.Product ||
  mongoose.model("Product", ProductSchema);
