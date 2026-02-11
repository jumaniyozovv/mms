import { getPendingDayOffs } from "@/backend/services/day-off.service";
import { withAuth } from "@/backend/middleware/auth";
import { successResponse, errorResponse } from "@/backend/utils/api-response";

export const GET = withAuth(async (_request, { user }) => {
  try {
    const pending = await getPendingDayOffs(user.userId, user.role);
    return successResponse(pending);
  } catch (error) {
    console.error("Get pending day offs error:", error);
    return errorResponse("Internal server error", 500);
  }
});
