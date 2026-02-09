"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { checkRegistrationStatus, getMe, login, logout, register } from "../services/auth.service";

export const authKeys = {
  all: ["auth"] as const,
  me: () => [...authKeys.all, "me"] as const,
  registrationStatus: () => [...authKeys.all, "registration-status"] as const,
};

export function useMe() {
  return useQuery({
    queryKey: authKeys.me(),
    queryFn: getMe,
    staleTime: 5 * 60 * 1000,
    retry: false,
  });
}

export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      queryClient.setQueryData(authKeys.me(), data.user);
    },
  });
}

export function useRegister() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: register,
    onSuccess: (data) => {
      queryClient.setQueryData(authKeys.me(), data.user);
    },
  });
}

export function useLogout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: logout,
    onSettled: () => {
      queryClient.clear();
    },
  });
}

export function useRegistrationStatus() {
  return useQuery({
    queryKey: authKeys.registrationStatus(),
    queryFn: checkRegistrationStatus,
    staleTime: 30 * 1000,
  });
}
