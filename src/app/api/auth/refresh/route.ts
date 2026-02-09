import { NextRequest } from "next/server";
import { refreshAccessToken } from "@/backend/services/auth.service";
import { getCookie, saveTokens, clearTokens } from "@/shared/lib/cookie";
import {
  successResponse,
  unauthorizedResponse,
} from "@/backend/utils/api-response";

export async function POST(request: NextRequest) {
  try {
    // Accept refresh token from request body (mobile) or cookie (web)
    let refreshToken: string | null = null;
    try {
      const body = await request.json();
      refreshToken = body.refreshToken ?? null;
    } catch {
      // No body, fall through to cookie
    }
    if (!refreshToken) {
      refreshToken = await getCookie("refresh_token");
    }

    if (!refreshToken) {
      return unauthorizedResponse("No refresh token provided");
    }

    const result = await refreshAccessToken(refreshToken);
    if (!result) {
      await clearTokens();
      return unauthorizedResponse("Invalid or expired refresh token");
    }

    await saveTokens(result.accessToken, result.newRefreshToken);

    return successResponse({
      accessToken: result.accessToken,
      refreshToken: result.newRefreshToken,
    });
  } catch (error) {
    console.error("Refresh token error:", error);
    await clearTokens();
    return unauthorizedResponse("Failed to refresh token");
  }
}
