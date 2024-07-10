import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

const protectedRoutes = [
  "/dashboard",
  "/report",
  "/budget",
  "/income",
  "/expenses",
];
const authRoutes = ["/auth/login", "/auth/register"];

export async function middleware(request) {
  let session;
  try {
    session = await getServerSession(request);
    console.log(session);
  } catch (error) {
    console.error("Error getting session:", error);
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  const { pathname } = request.nextUrl;

  if (
    !session?.user &&
    (pathname === "/" ||
      protectedRoutes.some((route) => pathname.startsWith(route)))
  ) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  if (session?.user && authRoutes.some((route) => pathname.startsWith(route))) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}
