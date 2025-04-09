import { NextResponse } from "next/server";

export function middleware(req) {
  console.log("Middleware Running...");
  console.log("Token from cookies:", req.cookies.get("token")?.value);

  const token = req.cookies.get("token")?.value; 
  const protectedRoutes = ["/dashboard"];

  if (protectedRoutes.includes(req.nextUrl.pathname) && !token) {
    console.log("Redirecting to /login due to missing token...");
    return NextResponse.redirect(new URL("/login", req.url));
  }

  console.log("Token found, allowing access...");
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};