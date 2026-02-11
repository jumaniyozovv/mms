import { NextRequest } from "next/server";
import { createNewDayOff } from "@/backend/services/day-off.service";
import { createDayOffSchema } from "@/backend/validators/day-off.validators";
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

    const result = createDayOffSchema.safeParse(body);
    if (!result.success) {
      return validationErrorResponse(formatZodErrors(result.error));
    }

    const { data, error } = await createNewDayOff(user.userId, result.data);
    if (error) {
      return errorResponse(error);
    }

    return successResponse(data, 201);
  } catch (error) {
    console.error("Create day off error:", error);
    return errorResponse("Internal server error", 500);
  }
});
