import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const SESSION_COOKIE = "admin_session";

export function middleware(request: NextRequest) {
  const isAdminLogin = request.nextUrl.pathname === "/admin";
  const isAdminEditor =
    request.nextUrl.pathname.startsWith("/admin/editor") ||
    request.nextUrl.pathname === "/admin/editor";
  const sessionCookie = request.cookies.get(SESSION_COOKIE)?.value;

  if (isAdminLogin && sessionCookie) {
    return NextResponse.redirect(new URL("/admin/editor", request.url));
  }

  if (isAdminEditor && !sessionCookie) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin", "/admin/editor", "/admin/editor/:path*"],
};
