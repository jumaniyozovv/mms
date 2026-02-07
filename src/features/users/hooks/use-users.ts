"use client";

import { useQuery } from "@tanstack/react-query";
import * as usersApi from "../services/users.service";

export const usersKeys = {
  all: ["users"] as const,
  list: () => [...usersKeys.all, "list"] as const,
};

export function useUsers() {
  return useQuery({
    queryKey: usersKeys.list(),
    queryFn: usersApi.getUsers,
  });
}
