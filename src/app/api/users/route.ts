import { NextRequest } from "next/server";
import { createNewUser } from "@/backend/services/user.service";
import {
  createUserSchema,
} from "@/backend/validators/user.validators";
import { formatZodErrors } from "@/backend/validators/auth.validators";
import { withRole } from "@/backend/middleware/roles";
import {
  successResponse,
  errorResponse,
  validationErrorResponse,
} from "@/backend/utils/api-response";

export const POST = withRole("ADMIN", async (request: NextRequest) => {
  try {
    const body = await request.json();

    const result = createUserSchema.safeParse(body);
    if (!result.success) {
      return validationErrorResponse(formatZodErrors(result.error));
    }

    const user = await createNewUser(result.data);
    if (!user) {
      return errorResponse("User with this email already exists", 409);
    }

    return successResponse(user, 201);
  } catch (error) {
    console.error("Create user error:", error);
    return errorResponse("Internal server error", 500);
  }
});
