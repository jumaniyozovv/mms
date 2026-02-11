import { NextRequest } from "next/server";
import { listDayOffs } from "@/backend/services/day-off.service";
import { dayOffCalendarFilterSchema } from "@/backend/validators/day-off.validators";
import { formatZodErrors } from "@/backend/validators/auth.validators";
import { withAuth } from "@/backend/middleware/auth";
import {
  successResponse,
  errorResponse,
  validationErrorResponse,
} from "@/backend/utils/api-response";

export const POST = withAuth(async (request: NextRequest, { user }) => {
  try {
    const body = await request.json();

    const result = dayOffCalendarFilterSchema.safeParse(body);
    if (!result.success) {
      return validationErrorResponse(formatZodErrors(result.error));
    }

    const data = await listDayOffs(result.data, user.userId, user.role);
    return successResponse(data);
  } catch (error) {
    console.error("List day offs error:", error);
    return errorResponse("Internal server error", 500);
  }
});
