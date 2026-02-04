import { NextResponse } from "next/server";
import type { ApiResponse, ApiError } from "@/backend/types/api.types";

export function successResponse<T>(
  data: T,
  status: number = 200
): NextResponse<ApiResponse<T>> {
  return NextResponse.json({ success: true, data }, { status });
}

export function errorResponse(
  message: string,
  status: number = 400,
  errors?: Record<string, string[]>
): NextResponse<ApiError> {
  return NextResponse.json(
    { success: false, error: message, errors },
    { status }
  );
}

export function unauthorizedResponse(
  message: string = "Unauthorized"
): NextResponse<ApiError> {
  return errorResponse(message, 401);
}

export function forbiddenResponse(
  message: string = "Forbidden"
): NextResponse<ApiError> {
  return errorResponse(message, 403);
}

export function notFoundResponse(
  message: string = "Not found"
): NextResponse<ApiError> {
  return errorResponse(message, 404);
}

export function validationErrorResponse(
  errors: Record<string, string[]>
): NextResponse<ApiError> {
  return errorResponse("Validation failed", 400, errors);
}
