import { serialize, parse } from "cookie";
import { AUTH_CONSTANTS } from "@/backend/config/constants";

export function createRefreshTokenCookie(token: string): string {
  return serialize(AUTH_CONSTANTS.COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: AUTH_CONSTANTS.REFRESH_TOKEN_EXPIRY_DAYS * 24 * 60 * 60,
  });
}

export function clearRefreshTokenCookie(): string {
  return serialize(AUTH_CONSTANTS.COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
}

export function parseRefreshTokenFromCookie(
  cookieHeader: string | null
): string | null {
  if (!cookieHeader) return null;
  const cookies = parse(cookieHeader);
  return cookies[AUTH_CONSTANTS.COOKIE_NAME] || null;
}
