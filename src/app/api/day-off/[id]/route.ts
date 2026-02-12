import { NextRequest } from "next/server";
import {
  updateDayOffStatusById,
  deleteOwnDayOff,
} from "@/backend/services/day-off.service";
import { updateDayOffStatusSchema } from "@/backend/validators/day-off.validators";
import { formatZodErrors } from "@/backend/validators/auth.validators";
import { withRole } from "@/backend/middleware/roles";
import { withAuth } from "@/backend/middleware/auth";
import {
  successResponse,
  errorResponse,
  validationErrorResponse,
} from "@/backend/utils/api-response";

export const PUT = withRole(
  "ADMIN",
  async (request: NextRequest, { user }) => {
    try {
      const id = request.nextUrl.pathname.split("/").pop()!;
      const body = await request.json();

      const result = updateDayOffStatusSchema.safeParse(body);
      if (!result.success) {
        return validationErrorResponse(formatZodErrors(result.error));
      }

      const { data, error } = await updateDayOffStatusById(id, result.data, user.userId);
      if (error) {
        return errorResponse(error);
      }

      return successResponse(data);
    } catch (error) {
      console.error("Update day off status error:", error);
      return errorResponse("Internal server error", 500);
    }
  }
);

export const DELETE = withAuth(async (request: NextRequest, { user }) => {
  try {
    const id = request.nextUrl.pathname.split("/").pop()!;

    const { success, error } = await deleteOwnDayOff(id, user.userId);
    if (!success) {
      return errorResponse(error || "Failed to delete", 400);
    }

    return successResponse({ success: true });
  } catch (error) {
    console.error("Delete day off error:", error);
    return errorResponse("Internal server error", 500);
  }
});
