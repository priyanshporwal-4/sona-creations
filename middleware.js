import { NextResponse } from "next/server";

export function middleware(request) {
  const { pathname } = request.nextUrl;

  // 🔧 Maintenance mode
  if (
    process.env.MAINTENANCE_MODE === "true" &&
    !pathname.startsWith("/maintenance") &&
    !pathname.startsWith("/_next")
  ) {
    return NextResponse.rewrite(new URL("/maintenance", request.url));
  }

  // 🔐 Protect admin routes
  if (pathname.startsWith("/admin")) {
    const role = request.cookies.get("role")?.value;

    if (role !== "ADMIN") {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  return NextResponse.next();
}

// Apply only to these paths
export const config = {
  matcher: ["/admin/:path*"],
};
