export interface ApiError {
  error: string;
  errors?: Record<string, string[]>;
}
