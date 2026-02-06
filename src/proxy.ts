 import { NextResponse } from "next/server";                                                                 
  import type { NextRequest } from "next/server";
                                                                                                              
  const PUBLIC_PATHS = [               
    "/login",
    "/register",
    "/api/auth/login",
    "/api/auth/register",
    "/api/auth/logout",
    "/api/auth/refresh",
  ];
  const AUTH_PATHS = ["/login", "/register"];

  function decodeJwtPayload(token: string): { exp?: number } | null {
    try {
      const parts = token.split(".");
      if (parts.length !== 3) return null;
      return JSON.parse(atob(parts[1]));
    } catch {
      return null;
    }
  }

  function isTokenExpired(token: string): boolean {
    const payload = decodeJwtPayload(token);
    if (!payload?.exp) return true;
    return Date.now() >= payload.exp * 1000;
  }

  export default function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;

    const isPublicPath = PUBLIC_PATHS.some(
      (path) => pathname === path || pathname.startsWith(`${path}/`)
    );
    const isAuthPath = AUTH_PATHS.some((path) => pathname === path);
    const isApiPath = pathname.startsWith("/api/");

    const accessToken = request.cookies.get("access_token")?.value;
    const refreshToken = request.cookies.get("refresh_token")?.value;

    const isAccessTokenValid = accessToken && !isTokenExpired(accessToken);

    // No valid tokens on protected page - redirect to login
    if (!isPublicPath && !isApiPath && !isAccessTokenValid) {
      if (refreshToken) {
        return NextResponse.next(); // let client-side handle the refresh
      }
      const response = NextResponse.redirect(new URL("/login", request.url));
      response.cookies.delete("access_token");
      return response;
    }

    // Valid session + auth page → redirect to home
    if (isAuthPath && isAccessTokenValid) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    return NextResponse.next();
  }

  export const config = {
    matcher: [
      "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
    ],
  };
