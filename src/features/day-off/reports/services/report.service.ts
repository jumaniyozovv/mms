import { apiClient } from "@/shared/lib/axios";
import type { DayOffListItem, UserDayOffBalance } from "@/features/day-off/dashboard/types";

export function getMyReport(year: number): Promise<DayOffListItem[]> {
  return apiClient.get<DayOffListItem[]>(`/day-off/my-report?year=${year}`);
}

export function getBalance(year: number): Promise<UserDayOffBalance[]> {
  return apiClient.get<UserDayOffBalance[]>(`/day-off/balance?year=${year}`);
}
