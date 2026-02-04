import { NextRequest } from "next/server";
import { getCurrentUser } from "@/backend/services/auth.service";
import { withAuth } from "@/backend/middleware/auth";
import {
  successResponse,
  notFoundResponse,
  errorResponse,
} from "@/backend/utils/api-response";
import type { JwtPayload } from "@/backend/types/auth.types";

async function handler(
  request: NextRequest,
  { user }: { user: JwtPayload }
) {
  try {
    const currentUser = await getCurrentUser(user.userId);
    if (!currentUser) {
      return notFoundResponse("User not found");
    }

    return successResponse(currentUser);
  } catch (error) {
    console.error("Get current user error:", error);
    return errorResponse("Internal server error", 500);
  }
}

export const GET = withAuth(handler);
