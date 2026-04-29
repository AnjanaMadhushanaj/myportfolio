import { NextRequest, NextResponse } from "next/server";

// Section paths that are virtual (SPA scroll-based)
const SECTION_PATHS = ["/home", "/about", "/services", "/skills", "/projects"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // If visiting a section path directly (e.g. refresh on /about),
  // rewrite internally to "/" so the page loads correctly
  if (SECTION_PATHS.includes(pathname)) {
    return NextResponse.rewrite(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/home", "/about", "/services", "/skills", "/projects"],
};
