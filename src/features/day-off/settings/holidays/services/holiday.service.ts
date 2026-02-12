import { apiClient } from "@/shared/lib/axios";
import type { HolidayItem, CreateHolidayInput, UpdateHolidayInput } from "../types";

export function listHolidays(): Promise<HolidayItem[]> {
  return apiClient.get<HolidayItem[]>("/holidays");
}

export function listHolidaysInRange(
  startDate: string,
  endDate: string
): Promise<HolidayItem[]> {
  return apiClient.post<HolidayItem[]>("/holidays/in-range", { startDate, endDate });
}

export function createHoliday(input: CreateHolidayInput): Promise<HolidayItem> {
  return apiClient.post<HolidayItem>("/holidays", input);
}

export function updateHoliday(id: string, input: UpdateHolidayInput): Promise<HolidayItem> {
  return apiClient.put<HolidayItem>(`/holidays/${id}`, input);
}

export function deleteHoliday(id: string): Promise<void> {
  return apiClient.delete(`/holidays/${id}`);
}
