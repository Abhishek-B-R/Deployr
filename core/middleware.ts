import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import {
  checkRateLimit,
  getClientIp,
  getRateLimitStatus,
} from "@/lib/rateLimiter";

export default async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (
    pathname.startsWith("/x.svg") ||
    pathname.startsWith("/demo.mp4") ||
    pathname.startsWith("/logo.png") ||
    pathname.startsWith("/imgs")
  )
    return NextResponse.next();

  if (pathname.startsWith("/api/auth") || pathname.startsWith("/signin"))
    return NextResponse.next();

  // Allow rate-limited page to load without counting toward limit
  if (pathname !== "/rate-limited") {
    const ip = getClientIp(req);
    if (checkRateLimit(ip)) {
      const status = getRateLimitStatus(ip);
      const retry =
        status.limited && "retryAfterSeconds" in status
          ? status.retryAfterSeconds
          : 60;
      const url = new URL("/rate-limited", req.url);
      url.searchParams.set("retry", String(retry));
      return NextResponse.redirect(url);
    }
  }

  if (pathname === "/rate-limited") {
    return NextResponse.next();
  }

  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  if (!token && pathname !== "/") {
    return NextResponse.redirect(new URL("/signin", req.url));
  }

  if (token && pathname === "/api/auth/signin") {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
