import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export function middleware(request) {
  const { pathname } = request.nextUrl;

  /* -------------------------------------------------
   1️⃣ MAINTENANCE MODE (KEEP AS-IS, JUST IMPROVED)
  -------------------------------------------------- */
  if (
    process.env.MAINTENANCE_MODE === "true" &&
    !pathname.startsWith("/maintenance") &&
    !pathname.startsWith("/_next") &&
    !pathname.startsWith("/api")
  ) {
    return NextResponse.rewrite(
      new URL("/maintenance", request.url)
    );
  }

  /* -------------------------------------------------
   2️⃣ ADMIN ROUTE PROTECTION
  -------------------------------------------------- */
  if (pathname.startsWith("/admin")) {
    const token = request.cookies.get("token")?.value;

    // ❌ No token → redirect to login
    if (!token) {
      return NextResponse.redirect(
        new URL("/login", request.url)
      );
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // ❌ Not admin → redirect
      if (!["ADMIN", "SUPER_ADMIN"].includes(decoded.role)) {
        return NextResponse.redirect(
          new URL("/", request.url)
        );
      }
    } catch (err) {
      // ❌ Invalid / expired token
      return NextResponse.redirect(
        new URL("/login", request.url)
      );
    }
  }

  return NextResponse.next();
}

/* -------------------------------------------------
 3️⃣ APPLY MIDDLEWARE ONLY WHERE NEEDED
-------------------------------------------------- */
export const config = {
  matcher: ["/admin/:path*", "/((?!_next/static|_next/image|favicon.ico).*)"],
};
