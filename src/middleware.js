import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

const protectedRoutes = [
  "/home",
  "/dashboard",
  "/income",
  "/budget",
  "/expenses",
  "/report",
];

export async function middleware(req) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const { pathname } = req.nextUrl;

  if (pathname === "/login" || pathname === "/register") {
    return NextResponse.next();
  }

  if (protectedRoutes.some((route) => pathname.startsWith(route))) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
    return NextResponse.next();
  }
  if (token && pathname === "/") {
    return NextResponse.redirect(new URL("/home", req.url));
  }
  if (!token && pathname === "/") {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}
