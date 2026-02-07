import { apiClient } from "@/shared/lib/axios";
import type { UserWithSessions } from "../types";

export function getUsers(): Promise<UserWithSessions[]> {
  return apiClient.get<UserWithSessions[]>("/users");
}
