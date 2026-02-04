import { NextRequest } from "next/server";
import { register, canRegister } from "@/backend/services/auth.service";
import {
  registerSchema,
  formatZodErrors,
} from "@/backend/validators/auth.validators";
import { createRefreshTokenCookie } from "@/backend/lib/cookie";
import {
  successResponse,
  errorResponse,
  validationErrorResponse,
} from "@/backend/utils/api-response";

export async function GET() {
  try {
    const isRegistrationOpen = await canRegister();
    return successResponse({ registrationOpen: isRegistrationOpen });
  } catch (error) {
    console.error("Check registration error:", error);
    return errorResponse("Internal server error", 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    // Check if registration is allowed
    const isRegistrationOpen = await canRegister();
    if (!isRegistrationOpen) {
      return errorResponse("Registration is closed", 403);
    }

    const body = await request.json();

    const result = registerSchema.safeParse(body);
    if (!result.success) {
      return validationErrorResponse(formatZodErrors(result.error));
    }

    const registerResult = await register(result.data);
    if (!registerResult) {
      return errorResponse("Registration failed", 400);
    }

    const response = successResponse(registerResult.authResult);
    response.headers.set(
      "Set-Cookie",
      createRefreshTokenCookie(registerResult.refreshToken)
    );

    return response;
  } catch (error) {
    console.error("Register error:", error);
    return errorResponse("Internal server error", 500);
  }
}
