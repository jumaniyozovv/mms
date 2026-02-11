import { getUserDayOffUsage } from "@/backend/services/day-off.service";
import { withAuth } from "@/backend/middleware/auth";
import {
  successResponse,
  errorResponse,
  notFoundResponse,
} from "@/backend/utils/api-response";

export const GET = withAuth(async (_request, { user }) => {
  try {
    const usage = await getUserDayOffUsage(user.userId);
    if (!usage) {
      return notFoundResponse("User not found");
    }

    return successResponse(usage);
  } catch (error) {
    console.error("Get day off usage error:", error);
    return errorResponse("Internal server error", 500);
  }
});
