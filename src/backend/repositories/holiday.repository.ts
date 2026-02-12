import { prisma } from "@/backend/lib/prisma";
import type { Holiday } from "@/app/generated/prisma/client";
import { format } from "date-fns";

export async function createHoliday(data: {
  name: string;
  date: Date;
  recurring: boolean;
}): Promise<Holiday> {
  return prisma.holiday.create({ data });
}

export async function findAllHolidays(): Promise<Holiday[]> {
  return prisma.holiday.findMany({ orderBy: { date: "asc" } });
}

export async function findHolidayById(id: string): Promise<Holiday | null> {
  return prisma.holiday.findUnique({ where: { id } });
}

export async function updateHoliday(
  id: string,
  data: { name: string; date: Date; recurring: boolean }
): Promise<Holiday> {
  return prisma.holiday.update({ where: { id }, data });
}

export async function deleteHoliday(id: string): Promise<Holiday> {
  return prisma.holiday.delete({ where: { id } });
}

export async function findHolidaysInRange(
  startDate: Date,
  endDate: Date
): Promise<Holiday[]> {
  const nonRecurring = await prisma.holiday.findMany({
    where: {
      recurring: false,
      date: { gte: startDate, lte: endDate },
    },
  });

  const recurring = await prisma.holiday.findMany({
    where: { recurring: true },
  });

  const startYear = startDate.getFullYear();
  const endYear = endDate.getFullYear();

  const materializedRecurring: Holiday[] = [];
  for (const h of recurring) {
    const month = h.date.getMonth();
    const day = h.date.getDate();
    for (let year = startYear; year <= endYear; year++) {
      const materialized = new Date(year, month, day);
      if (materialized >= startDate && materialized <= endDate) {
        materializedRecurring.push({
          ...h,
          date: materialized,
        });
      }
    }
  }

  return [...nonRecurring, ...materializedRecurring].sort(
    (a, b) => a.date.getTime() - b.date.getTime()
  );
}

export async function getHolidayDatesForYear(year: number): Promise<Set<string>> {
  const holidays = await prisma.holiday.findMany();

  const dates = new Set<string>();
  for (const h of holidays) {
    if (h.recurring) {
      const materialized = new Date(year, h.date.getMonth(), h.date.getDate());
      dates.add(format(materialized, "yyyy-MM-dd"));
    } else if (h.date.getFullYear() === year) {
      dates.add(format(h.date, "yyyy-MM-dd"));
    }
  }

  return dates;
}
