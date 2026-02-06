import { apiClient } from "@/shared/lib/axios";
import type {
  LoginCredentials,
  RegisterCredentials,
  ChangePasswordInput,
  AuthResponse,
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

export function refreshToken(): Promise<{ message: string }> {
  return apiClient.post<{ message: string }>("/auth/refresh");
}

export function getMe(): Promise<AuthUser> {
  return apiClient.get<AuthUser>("/auth/me");
}

export function changePassword(input: ChangePasswordInput): Promise<{ message: string }> {
  return apiClient.post<{ message: string }>("/auth/change-password", input);
}
