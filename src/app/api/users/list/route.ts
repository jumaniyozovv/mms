import { NextRequest } from "next/server";
import { listUsers } from "@/backend/services/user.service";
import { userListSchema } from "@/backend/validators/user.validators";
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

    const result = userListSchema.safeParse(body);
    if (!result.success) {
      return validationErrorResponse(formatZodErrors(result.error));
    }

    const data = await listUsers(result.data);
    return successResponse(data);
  } catch (error) {
    console.error("List users error:", error);
    return errorResponse("Internal server error", 500);
  }
});
