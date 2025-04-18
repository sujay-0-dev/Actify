import { NextResponse } from "next/server"
import { jwtVerify } from "jose"

// JWT secret would typically come from environment variables
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"

// Routes that require authentication
const protectedRoutes = ["/profile", "/settings", "/hazard-reporting/create"]

export async function middleware(request) {
  const { pathname } = request.nextUrl

  // Check if the route requires authentication
  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route))

  if (isProtectedRoute) {
    // Get the token from the cookies
    const token = request.cookies.get("token")?.value

    if (!token) {
      // Redirect to login if no token is found
      const url = new URL("/login", request.url)
      url.searchParams.set("redirect", pathname)
      return NextResponse.redirect(url)
    }

    try {
      // Verify the token
      await jwtVerify(token, new TextEncoder().encode(JWT_SECRET))

      // Token is valid, continue to the protected route
      return NextResponse.next()
    } catch (error) {
      // Token is invalid, redirect to login
      const url = new URL("/login", request.url)
      url.searchParams.set("redirect", pathname)
      return NextResponse.redirect(url)
    }
  }

  // For non-protected routes, continue normally
  return NextResponse.next()
}

export const config = {
  matcher: ["/profile/:path*", "/settings/:path*", "/hazard-reporting/create/:path*"],
}
