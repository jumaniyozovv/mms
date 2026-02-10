import { apiClient } from "@/shared/lib/axios";
import type {
  UserListItem,
  UserListFilters,
  PaginatedResponse,
  CreateUserInput,
} from "../types";

export function listUsers(
  filters: UserListFilters
): Promise<PaginatedResponse<UserListItem>> {
  return apiClient.post<PaginatedResponse<UserListItem>>(
    "/users/list",
    filters
  );
}

export function createUser(input: CreateUserInput): Promise<UserListItem> {
  return apiClient.post<UserListItem>("/users", input);
}
