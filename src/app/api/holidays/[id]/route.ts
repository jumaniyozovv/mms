import { NextRequest } from "next/server";
import { updateHolidayById, deleteHolidayById } from "@/backend/services/holiday.service";
import { updateHolidaySchema } from "@/backend/validators/holiday.validators";
import { formatZodErrors } from "@/backend/validators/auth.validators";
import { withRole } from "@/backend/middleware/roles";
import {
  successResponse,
  errorResponse,
  validationErrorResponse,
} from "@/backend/utils/api-response";

export const PUT = withRole("MANAGER", async (request: NextRequest) => {
  try {
    const id = request.nextUrl.pathname.split("/").pop()!;
    const body = await request.json();

    const result = updateHolidaySchema.safeParse(body);
    if (!result.success) {
      return validationErrorResponse(formatZodErrors(result.error));
    }

    const { data, error } = await updateHolidayById(id, result.data);
    if (error) {
      return errorResponse(error, 404);
    }

    return successResponse(data);
  } catch (error) {
    console.error("Update holiday error:", error);
    return errorResponse("Internal server error", 500);
  }
});

export const DELETE = withRole("MANAGER", async (request: NextRequest) => {
  try {
    const id = request.nextUrl.pathname.split("/").pop()!;

    const { success, error } = await deleteHolidayById(id);
    if (!success) {
      return errorResponse(error || "Failed to delete", 404);
    }

    return successResponse({ success: true });
  } catch (error) {
    console.error("Delete holiday error:", error);
    return errorResponse("Internal server error", 500);
  }
});
