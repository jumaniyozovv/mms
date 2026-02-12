import { NextRequest } from "next/server";
import { listHolidaysInRange } from "@/backend/services/holiday.service";
import { dayOffCalendarFilterSchema } from "@/backend/validators/day-off.validators";
import { formatZodErrors } from "@/backend/validators/auth.validators";
import { withAuth } from "@/backend/middleware/auth";
import {
  successResponse,
  errorResponse,
  validationErrorResponse,
} from "@/backend/utils/api-response";

export const POST = withAuth(async (request: NextRequest) => {
  try {
    const body = await request.json();

    const result = dayOffCalendarFilterSchema.safeParse(body);
    if (!result.success) {
      return validationErrorResponse(formatZodErrors(result.error));
    }

    const holidays = await listHolidaysInRange(result.data.startDate, result.data.endDate);
    return successResponse(holidays);
  } catch (error) {
    console.error("List holidays in range error:", error);
    return errorResponse("Internal server error", 500);
  }
});
