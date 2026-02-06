"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as authApi from "../services/auth.service";
import type { AuthUser } from "../types";

export const authKeys = {
  all: ["auth"] as const,
  me: () => [...authKeys.all, "me"] as const,
  registrationStatus: () => [...authKeys.all, "registration-status"] as const,
};

export function useMe() {
  return useQuery({
    queryKey: authKeys.me(),
    queryFn: async (): Promise<AuthUser | null> => {
      try {
        await authApi.refreshToken();
        return await authApi.getMe();
      } catch {
        return null;
      }
    },
    staleTime: 5 * 60 * 1000,
    retry: false,
  });
}

export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      queryClient.setQueryData(authKeys.me(), data.user);
    },
  });
}

export function useRegister() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authApi.register,
    onSuccess: (data) => {
      queryClient.setQueryData(authKeys.me(), data.user);
    },
  });
}

export function useLogout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authApi.logout,
    onSettled: () => {
      queryClient.clear();
    },
  });
}

export function useRegistrationStatus() {
  return useQuery({
    queryKey: authKeys.registrationStatus(),
    queryFn: authApi.checkRegistrationStatus,
    staleTime: 30 * 1000,
  });
}
