export interface ApiResponse<T> {
  success: true;
  data: T;
}

export interface ApiError {
  success: false;
  error: string;
  errors?: Record<string, string[]>;
}

export type ApiResult<T> = ApiResponse<T> | ApiError;
