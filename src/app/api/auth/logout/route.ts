import { logout } from "@/backend/services/auth.service";
import { getCookie, clearTokens } from "@/shared/lib/cookie";
import { successResponse } from "@/backend/utils/api-response";

export async function POST() {
  try {
    const refreshToken = await getCookie("refresh_token");

    if (refreshToken) {
      await logout(refreshToken);
    }

    await clearTokens();

    return successResponse({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Logout error:", error);
    await clearTokens();
    return successResponse({ message: "Logged out successfully" });
  }
}
