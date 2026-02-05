import { NextResponse } from "next/server";
import type { ApiError } from "@/backend/types/api.types";

export function successResponse<T>(data: T, status: number = 200): NextResponse<T> {
  return NextResponse.json(data, { status });
}

export function errorResponse(
  message: string,
  status: number = 400,
  errors?: Record<string, string[]>
): NextResponse<ApiError> {
  return NextResponse.json({ error: message, errors }, { status });
}

export function unauthorizedResponse(message: string = "Unauthorized"): NextResponse<ApiError> {
  return errorResponse(message, 401);
}

export function forbiddenResponse(message: string = "Forbidden"): NextResponse<ApiError> {
  return errorResponse(message, 403);
}

export function notFoundResponse(message: string = "Not found"): NextResponse<ApiError> {
  return errorResponse(message, 404);
}

export function validationErrorResponse(errors: Record<string, string[]>): NextResponse<ApiError> {
  return errorResponse("Validation failed", 400, errors);
}
