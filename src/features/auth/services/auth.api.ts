import { apiClient } from "@/shared/lib/axios";
import type {
  LoginCredentials,
  RegisterCredentials,
  ChangePasswordInput,
  AuthResponse,
  RefreshResponse,
  RegistrationStatusResponse,
  AuthUser,
  ApiResult,
} from "../types";

export async function checkRegistrationStatus(): Promise<ApiResult<RegistrationStatusResponse>> {
  return apiClient.get<RegistrationStatusResponse>("/auth/register");
}

export async function register(
  credentials: RegisterCredentials
): Promise<ApiResult<AuthResponse>> {
  return apiClient.post<AuthResponse>("/auth/register", credentials);
}

export async function login(
  credentials: LoginCredentials
): Promise<ApiResult<AuthResponse>> {
  return apiClient.post<AuthResponse>("/auth/login", credentials);
}

export async function logout(): Promise<ApiResult<{ message: string }>> {
  return apiClient.post<{ message: string }>("/auth/logout");
}

export async function refreshToken(): Promise<ApiResult<RefreshResponse>> {
  return apiClient.post<RefreshResponse>("/auth/refresh");
}

export async function getMe(accessToken: string): Promise<ApiResult<AuthUser>> {
  // For this specific call, we pass the token manually since it might be
  // called before the global token is set
  return apiClient.get<AuthUser>("/auth/me", {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
}

export async function changePassword(
  input: ChangePasswordInput
): Promise<ApiResult<{ message: string }>> {
  return apiClient.post<{ message: string }>("/auth/change-password", input);
}
