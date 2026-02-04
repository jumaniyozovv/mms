import { NextRequest } from "next/server";
import { login } from "@/backend/services/auth.service";
import {
  loginSchema,
  formatZodErrors,
} from "@/backend/validators/auth.validators";
import { createRefreshTokenCookie } from "@/backend/lib/cookie";
import {
  successResponse,
  errorResponse,
  validationErrorResponse,
} from "@/backend/utils/api-response";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const result = loginSchema.safeParse(body);
    if (!result.success) {
      return validationErrorResponse(formatZodErrors(result.error));
    }

    const loginResult = await login(result.data);
    if (!loginResult) {
      return errorResponse("Invalid email or password", 401);
    }

    const response = successResponse(loginResult.authResult);
    response.headers.set(
      "Set-Cookie",
      createRefreshTokenCookie(loginResult.refreshToken)
    );

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return errorResponse("Internal server error", 500);
  }
}
