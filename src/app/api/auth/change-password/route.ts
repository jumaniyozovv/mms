import { NextRequest } from "next/server";
import { changePassword } from "@/backend/services/auth.service";
import { withAuth } from "@/backend/middleware/auth";
import {
  changePasswordSchema,
  formatZodErrors,
} from "@/backend/validators/auth.validators";
import { clearRefreshTokenCookie } from "@/backend/lib/cookie";
import {
  successResponse,
  errorResponse,
  validationErrorResponse,
} from "@/backend/utils/api-response";
import type { JwtPayload } from "@/backend/types/auth.types";

async function handler(
  request: NextRequest,
  { user }: { user: JwtPayload }
) {
  try {
    const body = await request.json();

    const result = changePasswordSchema.safeParse(body);
    if (!result.success) {
      return validationErrorResponse(formatZodErrors(result.error));
    }

    const success = await changePassword(user.userId, result.data);
    if (!success) {
      return errorResponse("Current password is incorrect", 400);
    }

    const response = successResponse({
      message: "Password changed successfully",
    });
    response.headers.set("Set-Cookie", clearRefreshTokenCookie());

    return response;
  } catch (error) {
    console.error("Change password error:", error);
    return errorResponse("Internal server error", 500);
  }
}

export const POST = withAuth(handler);
