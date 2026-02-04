import { NextRequest } from "next/server";
import { refreshAccessToken } from "@/backend/services/auth.service";
import {
  parseRefreshTokenFromCookie,
  createRefreshTokenCookie,
  clearRefreshTokenCookie,
} from "@/backend/lib/cookie";
import {
  successResponse,
  unauthorizedResponse,
} from "@/backend/utils/api-response";

export async function POST(request: NextRequest) {
  try {
    const cookieHeader = request.headers.get("cookie");
    const refreshToken = parseRefreshTokenFromCookie(cookieHeader);

    if (!refreshToken) {
      return unauthorizedResponse("No refresh token provided");
    }

    const result = await refreshAccessToken(refreshToken);
    if (!result) {
      const response = unauthorizedResponse("Invalid or expired refresh token");
      response.headers.set("Set-Cookie", clearRefreshTokenCookie());
      return response;
    }

    const response = successResponse({ accessToken: result.accessToken });
    response.headers.set(
      "Set-Cookie",
      createRefreshTokenCookie(result.newRefreshToken)
    );

    return response;
  } catch (error) {
    console.error("Refresh token error:", error);
    const response = unauthorizedResponse("Failed to refresh token");
    response.headers.set("Set-Cookie", clearRefreshTokenCookie());
    return response;
  }
}
