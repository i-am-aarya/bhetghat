import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  if (process.env.NEXT_PUBLIC_DEVELOPMENT === "true") {
    return NextResponse.next();
  }
  if (req.nextUrl.pathname === "/") {
    return NextResponse.redirect(new URL("/home", req.url));
  }

  const authToken = req.cookies.get("authToken");

  const isAuthRoute =
    req.nextUrl.pathname.startsWith("/login") ||
    req.nextUrl.pathname.startsWith("/register");

  const isProtectedRoute =
    req.nextUrl.pathname.startsWith("/game") ||
    req.nextUrl.pathname.startsWith("/character");

  if (isProtectedRoute && !authToken) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (isAuthRoute && authToken) {
    return NextResponse.redirect(new URL("/game", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/game", "/login", "/register", "/character"],
};
