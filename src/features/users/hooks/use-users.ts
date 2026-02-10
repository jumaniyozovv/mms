import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { listUsers, createUser } from "../services";
import type { UserListFilters, CreateUserInput } from "../types";

export const userKeys = {
  all: ["users"] as const,
  list: (filters: UserListFilters) => [...userKeys.all, "list", filters] as const,
};

export function useUsers(filters: UserListFilters) {
  return useQuery({
    queryKey: userKeys.list(filters),
    queryFn: () => listUsers(filters),
    placeholderData: (prev) => prev,
  });
}

export function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateUserInput) => createUser(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.all });
    },
  });
}
