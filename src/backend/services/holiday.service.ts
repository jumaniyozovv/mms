import {
  createHoliday,
  findAllHolidays,
  findHolidayById,
  updateHoliday,
  deleteHoliday,
  findHolidaysInRange,
} from "@/backend/repositories/holiday.repository";
import type { Holiday } from "@/app/generated/prisma/client";
import type {
  HolidayItem,
  CreateHolidayInput,
  UpdateHolidayInput,
} from "@/backend/types/holiday.types";

function toHolidayItem(holiday: Holiday): HolidayItem {
  return {
    id: holiday.id,
    name: holiday.name,
    date: holiday.date,
    createdAt: holiday.createdAt.toISOString(),
  };
}

export async function createNewHoliday(
  input: CreateHolidayInput
): Promise<HolidayItem> {
  const holiday = await createHoliday({
    name: input.name,
    date: input.date,
  });
  return toHolidayItem(holiday);
}

export async function listAllHolidays(): Promise<HolidayItem[]> {
  const holidays = await findAllHolidays();
  return holidays.map(toHolidayItem);
}

export async function updateHolidayById(
  id: string,
  input: UpdateHolidayInput
): Promise<{ data?: HolidayItem; error?: string }> {
  const existing = await findHolidayById(id);
  if (!existing) return { error: "Holiday not found" };

  const updated = await updateHoliday(id, {
    name: input.name,
    date: input.date,
  });
  return { data: toHolidayItem(updated) };
}

export async function deleteHolidayById(
  id: string
): Promise<{ success: boolean; error?: string }> {
  const existing = await findHolidayById(id);
  if (!existing) return { success: false, error: "Holiday not found" };

  await deleteHoliday(id);
  return { success: true };
}

export async function listHolidaysInRange(
  startDate: string,
  endDate: string
): Promise<HolidayItem[]> {
  const results = await findHolidaysInRange(
    new Date(startDate),
    new Date(endDate)
  );
  return results.map((r) => ({
    id: r.id,
    name: r.name,
    date: r.date,
    createdAt: "",
  }));
}
