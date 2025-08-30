import { type NextRequest, NextResponse } from "next/server"
import { verifyToken } from "./lib/auth"

export function middleware(request: NextRequest) {
  const token = request.cookies.get("auth-token")?.value

  // Protect admin routes
  if (request.nextUrl.pathname.startsWith("/admin")) {
    if (!token) {
      return NextResponse.redirect(new URL("/auth/login", request.url))
    }

    const payload = verifyToken(token)
    if (!payload || payload.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/auth/login", request.url))
    }
  }

  // Protect user routes
  if (request.nextUrl.pathname.startsWith("/my-complaints")) {
    if (!token) {
      return NextResponse.redirect(new URL("/auth/login", request.url))
    }

    const payload = verifyToken(token)
    if (!payload) {
      return NextResponse.redirect(new URL("/auth/login", request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*", "/my-complaints/:path*"],
}
