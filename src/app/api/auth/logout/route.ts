import { NextRequest } from "next/server";
import { logout } from "@/backend/services/auth.service";
import {
  parseRefreshTokenFromCookie,
  clearRefreshTokenCookie,
} from "@/backend/lib/cookie";
import { successResponse } from "@/backend/utils/api-response";

export async function POST(request: NextRequest) {
  try {
    const cookieHeader = request.headers.get("cookie");
    const refreshToken = parseRefreshTokenFromCookie(cookieHeader);

    if (refreshToken) {
      await logout(refreshToken);
    }

    const response = successResponse({ message: "Logged out successfully" });
    response.headers.set("Set-Cookie", clearRefreshTokenCookie());

    return response;
  } catch (error) {
    console.error("Logout error:", error);
    const response = successResponse({ message: "Logged out successfully" });
    response.headers.set("Set-Cookie", clearRefreshTokenCookie());
    return response;
  }
}
