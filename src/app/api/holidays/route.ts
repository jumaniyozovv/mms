import { NextRequest } from "next/server";
import { createNewHoliday, listAllHolidays } from "@/backend/services/holiday.service";
import { createHolidaySchema } from "@/backend/validators/holiday.validators";
import { formatZodErrors } from "@/backend/validators/auth.validators";
import { withAuth } from "@/backend/middleware/auth";
import { withRole } from "@/backend/middleware/roles";
import {
  successResponse,
  errorResponse,
  validationErrorResponse,
} from "@/backend/utils/api-response";

export const GET = withAuth(async () => {
  try {
    const holidays = await listAllHolidays();
    return successResponse(holidays);
  } catch (error) {
    console.error("List holidays error:", error);
    return errorResponse("Internal server error", 500);
  }
});

export const POST = withRole("MANAGER", async (request: NextRequest) => {
  try {
    const body = await request.json();

    const result = createHolidaySchema.safeParse(body);
    if (!result.success) {
      return validationErrorResponse(formatZodErrors(result.error));
    }

    const holiday = await createNewHoliday(result.data);
    return successResponse(holiday, 201);
  } catch (error) {
    console.error("Create holiday error:", error);
    return errorResponse("Internal server error", 500);
  }
});
