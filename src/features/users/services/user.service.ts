import { apiClient } from "@/shared/lib/axios";
import type {
  UserListItem,
  UserListFilters,
  PaginatedResponse,
  CreateUserInput,
  UpdateUserInput,
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

export function updateUser(id: string, input: UpdateUserInput): Promise<UserListItem> {
  return apiClient.put<UserListItem>(`/users/${id}`, input);
}

export function deleteUser(id: string): Promise<void> {
  return apiClient.delete(`/users/${id}`);
}
