import connectDB from "@/lib/db";
import Product from "@/models/Product";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  try {
    await connectDB();

    // Normalize slug
    const slug = decodeURIComponent(params.slug).trim().toLowerCase();

    const product = await Product.findOne({
      slug: { $regex: `^${slug}$`, $options: "i" },
    });

    if (!product) {
      return NextResponse.json(
        { message: "Product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(product);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
