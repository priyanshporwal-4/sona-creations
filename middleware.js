import { NextResponse } from "next/server";

export function middleware(request) {
  // Allow assets and api routes if you want
  const { pathname } = request.nextUrl;

  if (
    process.env.MAINTENANCE_MODE === "true" &&
    !pathname.startsWith("/maintenance") &&
    !pathname.startsWith("/_next")
  ) {
    return NextResponse.rewrite(new URL("/maintenance", request.url));
  }
}
