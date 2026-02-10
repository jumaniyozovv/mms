import { NextRequest } from "next/server";
import {
  updateExistingUser,
  deleteExistingUser,
} from "@/backend/services/user.service";
import { updateUserSchema } from "@/backend/validators/user.validators";
import { formatZodErrors } from "@/backend/validators/auth.validators";
import { withRole } from "@/backend/middleware/roles";
import {
  successResponse,
  errorResponse,
  notFoundResponse,
  validationErrorResponse,
} from "@/backend/utils/api-response";

export const PUT = withRole("ADMIN", async (request: NextRequest, { user }) => {
  try {
    const id = request.nextUrl.pathname.split("/").pop()!;
    const body = await request.json();

    const result = updateUserSchema.safeParse(body);
    if (!result.success) {
      return validationErrorResponse(formatZodErrors(result.error));
    }

    const updated = await updateExistingUser(id, result.data);
    if (!updated) {
      return notFoundResponse("User not found");
    }

    return successResponse(updated);
  } catch (error) {
    console.error("Update user error:", error);
    return errorResponse("Internal server error", 500);
  }
});

export const DELETE = withRole("ADMIN", async (request: NextRequest, { user }) => {
  try {
    const id = request.nextUrl.pathname.split("/").pop()!;

    const result = await deleteExistingUser(id, user.userId);
    if (!result.success) {
      const status = result.error === "User not found" ? 404 : 400;
      return errorResponse(result.error!, status);
    }

    return successResponse({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Delete user error:", error);
    return errorResponse("Internal server error", 500);
  }
});
