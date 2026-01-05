import connectDB from "@/lib/db";
import Order from "@/models/Order";
import { NextResponse } from "next/server";

export async function PATCH(req, { params }) {
  const { id } = await params;
  const { status } = await req.json();

  await connectDB();

  await Order.findByIdAndUpdate(id, { status });

  return NextResponse.json({ success: true });
}
