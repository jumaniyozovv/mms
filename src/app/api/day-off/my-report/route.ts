import { getUserDayOffReport } from "@/backend/services/day-off.service";
import { withAuth } from "@/backend/middleware/auth";
import { successResponse, errorResponse } from "@/backend/utils/api-response";

export const GET = withAuth(async (request, { user }) => {
  try {
    const { searchParams } = new URL(request.url);
    const year = Number(searchParams.get("year")) || new Date().getFullYear();

    const data = await getUserDayOffReport(user.userId, year);
    return successResponse(data);
  } catch (error) {
    console.error("Get day off report error:", error);
    return errorResponse("Internal server error", 500);
  }
});
