import connectDB from "@/lib/db";
import Product from "@/models/Product";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const body = await req.json();
    await connectDB();

    const product = await Product.create({
      name: body.name,
      slug: body.slug,
      description: body.description || "",
      price: body.price,
      category: body.category,
      sizes: body.sizes || [],
      images: body.images || [],
      stock: body.stock ?? 0,
      isActive: true, // 🔥 REQUIRED
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
