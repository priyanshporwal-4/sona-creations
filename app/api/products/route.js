import connectDB from "@/lib/db";
import Product from "@/models/Product";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectDB();

    const products = await Product.find({ isActive: true }).sort({
      createdAt: -1,
    });

    return NextResponse.json(products);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
