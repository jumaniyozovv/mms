import { NextRequest } from "next/server";
import { verifyAccessToken } from "@/backend/lib/jwt";
import { unauthorizedResponse } from "@/backend/utils/api-response";
import type { JwtPayload } from "@/backend/types/auth.types";

export function extractBearerToken(request: NextRequest): string | null {
  const authHeader = request.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) return null;
  return authHeader.slice(7);
}

export function verifyAuth(request: NextRequest): JwtPayload | null {
  const token = extractBearerToken(request);
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
