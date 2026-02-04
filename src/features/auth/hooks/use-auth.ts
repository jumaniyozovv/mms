"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import * as authApi from "../services/auth.api";
import { setAccessToken } from "@/shared/lib/axios";
import type {
  LoginCredentials,
  RegisterCredentials,
  AuthUser,
} from "../types";

// Query keys
export const authKeys = {
  all: ["auth"] as const,
  me: () => [...authKeys.all, "me"] as const,
  registrationStatus: () => [...authKeys.all, "registration-status"] as const,
};

// Get current user
export function useMe() {
  return useQuery({
    queryKey: authKeys.me(),
    queryFn: async (): Promise<AuthUser | null> => {
      // First try to refresh token to get access token
      const refreshResult = await authApi.refreshToken();
      if (!refreshResult.success) {
        return null;
      }

      const accessToken = refreshResult.data.accessToken;
      setAccessToken(accessToken);

      const meResult = await authApi.getMe(accessToken);
      if (!meResult.success) {
        setAccessToken(null);
        return null;
      }

      return meResult.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: false,
  });
}

// Login mutation
export function useLogin() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: async (credentials: LoginCredentials) => {
      const result = await authApi.login(credentials);
      if (!result.success) {
        throw new Error(result.error);
      }
      return result.data;
    },
    onSuccess: (data) => {
      setAccessToken(data.accessToken);
      queryClient.setQueryData(authKeys.me(), data.user);
    },
    onError: () => {
      setAccessToken(null);
    },
  });
}

// Register mutation
export function useRegister() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (credentials: RegisterCredentials) => {
      const result = await authApi.register(credentials);
      if (!result.success) {
        throw new Error(result.error);
      }
      return result.data;
    },
    onSuccess: (data) => {
      setAccessToken(data.accessToken);
      queryClient.setQueryData(authKeys.me(), data.user);
    },
    onError: () => {
      setAccessToken(null);
    },
  });
}

// Logout mutation
export function useLogout() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: async () => {
      const result = await authApi.logout();
      if (!result.success) {
        throw new Error(result.error);
      }
      return result.data;
    },
    onSuccess: () => {
      setAccessToken(null);
      queryClient.setQueryData(authKeys.me(), null);
      queryClient.clear();
      router.push("/login");
    },
    onSettled: () => {
      // Always clear on logout attempt
      setAccessToken(null);
    },
  });
}

// Check registration status
export function useRegistrationStatus() {
  return useQuery({
    queryKey: authKeys.registrationStatus(),
    queryFn: async () => {
      const result = await authApi.checkRegistrationStatus();
      if (!result.success) {
        throw new Error(result.error);
      }
      return result.data;
    },
    staleTime: 30 * 1000, // 30 seconds
  });
}
