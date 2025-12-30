import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Product from "@/models/Product";

export async function DELETE(request, { params }) {
  const { id } = await params; // ✅ REQUIRED in Next 16

  await connectDB();
  await Product.findByIdAndDelete(id);

  return NextResponse.json({ success: true });
}

export async function GET(request, { params }) {
  const { id } = await params;

  await connectDB();
  const product = await Product.findById(id);

  return NextResponse.json(product);
}

export async function PUT(request, { params }) {
  const { id } = await params;
  const body = await request.json();

  await connectDB();
  await Product.findByIdAndUpdate(id, body);

  return NextResponse.json({ success: true });
}
