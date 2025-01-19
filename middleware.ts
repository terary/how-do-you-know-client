import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Add paths that should be protected
const protectedPaths = [
  "/question-templates",
  "/profile",
  "/learning-institutions",
  "/instructional-courses",
  "/exam-templates",
  // Add other protected routes here
];

// Add paths that should be accessible only to non-authenticated users
const authPaths = ["/login", "/signup"];

export function middleware(request: NextRequest) {
  // Check both cookie and authorization header
  const token =
    request.cookies.get("hdyk_token")?.value ||
    request.headers.get("authorization")?.replace("Bearer ", "");
  const { pathname } = request.nextUrl;

  // Skip middleware for API routes and preview endpoints
  if (pathname.startsWith("/api/") || pathname.includes("/preview")) {
    return NextResponse.next();
  }

  // Check if the path should be protected
  const isProtectedPath = protectedPaths.some((path) =>
    pathname.startsWith(path)
  );
  const isAuthPath = authPaths.some((path) => pathname.startsWith(path));

  // Redirect to login if accessing protected path without token
  if (isProtectedPath && !token) {
    const response = NextResponse.redirect(new URL("/login", request.url));
    return response;
  }

  // Redirect to home if accessing auth paths with token
  if (isAuthPath && token) {
    const response = NextResponse.redirect(new URL("/", request.url));
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!api|_next/static|_next/image|favicon.ico|public).*)",
  ],
};
