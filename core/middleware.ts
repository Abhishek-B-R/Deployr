import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export default async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  const { pathname } = req.nextUrl;

  if (pathname.startsWith("/x.svg") || pathname.startsWith("/demo.mp4") || pathname.startsWith("/logo.png") || pathname.startsWith("/imgs")) return NextResponse.next();

  if (pathname.startsWith("/api/auth") || pathname.startsWith("/signin")) return NextResponse.next();

  if (!token && pathname !== "/") {
    return NextResponse.redirect(new URL("/api/auth/signin", req.url));
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
}