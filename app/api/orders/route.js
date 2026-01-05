import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Order from "@/models/Order";

export async function POST(req) {
  await connectDB();
  const body = await req.json();

  const order = await Order.create(body);

  return NextResponse.json(order);
}
