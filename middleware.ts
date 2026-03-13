import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const PUBLIC_PATHS = ["/login"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Always allow public paths and Next.js internals
  if (PUBLIC_PATHS.includes(pathname)) {
    return NextResponse.next();
  }

  // Check auth via persisted Zustand store in localStorage isn't accessible
  // in middleware (server-side). We use a simple cookie-based check instead.
  // The auth-store will set this cookie on login.
  const isAuthenticated = request.cookies.get("sf-authenticated")?.value === "true";

  if (!isAuthenticated) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all paths except:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\..*).+)",
  ],
};
