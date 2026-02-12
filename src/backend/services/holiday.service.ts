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
import { format } from "date-fns";

function toHolidayItem(holiday: Holiday): HolidayItem {
  return {
    id: holiday.id,
    name: holiday.name,
    date: format(holiday.date, "yyyy-MM-dd"),
    recurring: holiday.recurring,
    createdAt: holiday.createdAt.toISOString(),
  };
}

export async function createNewHoliday(
  input: CreateHolidayInput
): Promise<HolidayItem> {
  const holiday = await createHoliday({
    name: input.name,
    date: new Date(input.date),
    recurring: input.recurring,
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
    date: new Date(input.date),
    recurring: input.recurring,
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
  const holidays = await findHolidaysInRange(
    new Date(startDate),
    new Date(endDate)
  );
  return holidays.map(toHolidayItem);
}
