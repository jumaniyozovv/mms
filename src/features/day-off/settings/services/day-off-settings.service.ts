import { apiClient } from "@/shared/lib/axios";
import type { DayOffConfig } from "../types";

export function getDayOffConfig(): Promise<DayOffConfig> {
  return apiClient.get<DayOffConfig>("/day-off/config");
}

export function updateDayOffConfig(data: DayOffConfig): Promise<DayOffConfig> {
  return apiClient.put<DayOffConfig>("/day-off/config", data);
}
