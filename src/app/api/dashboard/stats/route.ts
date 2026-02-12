import { withAuth } from "@/backend/middleware/auth";
import { getUserCount } from "@/backend/repositories/user.repository";
import {
  countDayOffsInMonth,
  countDayOffsToday,
} from "@/backend/repositories/day-off.repository";
import { successResponse, errorResponse } from "@/backend/utils/api-response";

export const GET = withAuth(async () => {
  try {
    const now = new Date();

    const [totalUsers, monthlyRequests, todaysRequests] = await Promise.all([
      getUserCount(),
      countDayOffsInMonth(now.getFullYear(), now.getMonth()),
      countDayOffsToday(),
    ]);

    return successResponse({ totalUsers, monthlyRequests, todaysRequests });
  } catch (error) {
    console.error("Dashboard stats error:", error);
    return errorResponse("Internal server error", 500);
  }
});
