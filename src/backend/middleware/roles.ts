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


// backend/middleware/roles.ts

/**
 * Can this user modify (update) this task?
 * - ADMIN/MANAGER: yes, any task.
 * - USER: only if they're the assignee.
 */
export function canModifyTask(
  role: UserRole,
  userId: string,
  task: { assigneeId: string | null }
): boolean {
  if (role === "ADMIN" || role === "MANAGER") return true;
  return task.assigneeId === userId;
}

/**
 * Can this user delete this task?
 * - ADMIN/MANAGER: yes, any task.
 * - USER:yes their own
 */
export function canDeleteTask(
  role: UserRole,
  userId: string,
  task: { assigneeId: string | null }
): boolean {
  if (role === "ADMIN" || role === "MANAGER") return true;
  return task.assigneeId === userId; // assignee can delete their own
}

export function canManageProjects(role: UserRole): boolean {
  return role === "ADMIN" || role === "MANAGER";
}