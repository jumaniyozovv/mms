export interface ApiError {
  error: string;
  errors?: Record<string, string[]>;
}
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
}
