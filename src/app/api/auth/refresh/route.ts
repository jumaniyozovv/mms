import { refreshAccessToken } from "@/backend/services/auth.service";
import { getCookie, saveTokens, clearTokens } from "@/shared/lib/cookie";
import {
  successResponse,
  unauthorizedResponse,
} from "@/backend/utils/api-response";

export async function POST() {
  try {
    const refreshToken = await getCookie("refresh_token");

    if (!refreshToken) {
      return unauthorizedResponse("No refresh token provided");
    }

    const result = await refreshAccessToken(refreshToken);
    if (!result) {
      await clearTokens();
      return unauthorizedResponse("Invalid or expired refresh token");
    }

    await saveTokens(result.accessToken, result.newRefreshToken);

    return successResponse({ message: "Token refreshed" });
  } catch (error) {
    console.error("Refresh token error:", error);
    await clearTokens();
    return unauthorizedResponse("Failed to refresh token");
  }
}
