import { NextRequest } from "next/server";
import { verifyAccessToken } from "@/backend/lib/jwt";
import { unauthorizedResponse } from "@/backend/utils/api-response";
import type { JwtPayload } from "@/backend/types/auth.types";

function extractToken(request: NextRequest): string | null {
  const authHeader = request.headers.get("authorization");
  if (authHeader?.startsWith("Bearer ")) {
    return authHeader.slice(7);
  }

  return request.cookies.get("access_token")?.value ?? null;
}

export function verifyAuth(request: NextRequest): JwtPayload | null {
  const token = extractToken(request);
  if (!token) return null;

  try {
    return verifyAccessToken(token);
  } catch {
    return null;
  }
}

export function withAuth(
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
    return handler(request, { user });
  };
}
