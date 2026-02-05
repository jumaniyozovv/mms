import { apiClient } from "@/shared/lib/axios";
import type {
  LoginCredentials,
  RegisterCredentials,
  ChangePasswordInput,
  AuthResponse,
  RefreshResponse,
  RegistrationStatusResponse,
  AuthUser,
} from "../types";

export function checkRegistrationStatus(): Promise<RegistrationStatusResponse> {
  return apiClient.get<RegistrationStatusResponse>("/auth/register");
}

export function register(credentials: RegisterCredentials): Promise<AuthResponse> {
  return apiClient.post<AuthResponse>("/auth/register", credentials);
}

export function login(credentials: LoginCredentials): Promise<AuthResponse> {
  return apiClient.post<AuthResponse>("/auth/login", credentials);
}

export function logout(): Promise<{ message: string }> {
  return apiClient.post<{ message: string }>("/auth/logout");
}

export function refreshToken(): Promise<RefreshResponse> {
  return apiClient.post<RefreshResponse>("/auth/refresh");
}

export function getMe(accessToken: string): Promise<AuthUser> {
  return apiClient.get<AuthUser>("/auth/me", {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
}

export function changePassword(input: ChangePasswordInput): Promise<{ message: string }> {
  return apiClient.post<{ message: string }>("/auth/change-password", input);
}
