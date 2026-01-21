import { NextResponse } from "next/server";

export function middleware(request) {
  const { pathname } = request.nextUrl;

  // 🚧 GLOBAL MAINTENANCE MODE (EVERYONE)
  if (
    process.env.MAINTENANCE_MODE === "true" &&
    !pathname.startsWith("/maintenance") &&
    !pathname.startsWith("/_next") &&
    !pathname.startsWith("/api")
  ) {
    return NextResponse.rewrite(new URL("/maintenance", request.url));
  }

  // 🔐 ADMIN PROTECTION
  if (pathname.startsWith("/admin")) {
    const role = request.cookies.get("role")?.value;

    if (role !== "ADMIN") {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  return NextResponse.next();
}

/**
 * 🔑 IMPORTANT:
 * Run middleware on ALL routes
 */
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
