import { apiClient } from "@/shared/lib/axios";
import type {
  DayOffListItem,
  CreateDayOffInput,
  DayOffCalendarFilters,
  UpdateDayOffStatusInput,
  DayOffUsage,
} from "../types";

export function listDayOffs(
  filters: DayOffCalendarFilters
): Promise<DayOffListItem[]> {
  return apiClient.post<DayOffListItem[]>("/day-off/list", filters);
}

export function createDayOff(input: CreateDayOffInput): Promise<DayOffListItem> {
  return apiClient.post<DayOffListItem>("/day-off", input);
}

export function updateDayOffStatus(
  id: string,
  input: UpdateDayOffStatusInput
): Promise<DayOffListItem> {
  return apiClient.put<DayOffListItem>(`/day-off/${id}`, input);
}

export function deleteDayOff(id: string): Promise<void> {
  return apiClient.delete(`/day-off/${id}`);
}

export function getDayOffUsage(): Promise<DayOffUsage> {
  return apiClient.get<DayOffUsage>("/day-off/usage");
}

export function getMyPendingDayOffs(): Promise<DayOffListItem[]> {
  return apiClient.get<DayOffListItem[]>("/day-off/my-pending");
}
