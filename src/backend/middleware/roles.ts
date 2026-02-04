import { NextRequest } from "next/server";
import { ROLE_HIERARCHY } from "@/backend/config/constants";
import { verifyAuth } from "@/backend/middleware/auth";
import {
  unauthorizedResponse,
  forbiddenResponse,
} from "@/backend/utils/api-response";
import type { JwtPayload } from "@/backend/types/auth.types";
import type { UserRole } from "@/app/generated/prisma/client";

export function hasRole(userRole: UserRole, requiredRole: UserRole): boolean {
  return ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[requiredRole];
}

export function withRole(
  requiredRole: UserRole,
  handler: (
    request: NextRequest,
    context: { user: JwtPayload }
  ) => Promise<Response>
) {
  return async (request: NextRequest) => {
    const user = verifyAuth(request);
    if (!user) {
      return unauthorizedResponse("Invalid or expired token");
    }

    if (!hasRole(user.role, requiredRole)) {
      return forbiddenResponse("Insufficient permissions");
    }

    return handler(request, { user });
  };
}
