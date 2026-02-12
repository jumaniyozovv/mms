import { prisma } from "@/backend/lib/prisma";
import type { Holiday } from "@/app/generated/prisma/client";

export async function createHoliday(data: {
  name: string;
  date: string;
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
  data: { name: string; date: string }
): Promise<Holiday> {
  return prisma.holiday.update({ where: { id }, data });
}

export async function deleteHoliday(id: string): Promise<Holiday> {
  return prisma.holiday.delete({ where: { id } });
}

export async function findHolidaysInRange(
  startDate: Date,
  endDate: Date
): Promise<{ id: string; name: string; date: string }[]> {
  const holidays = await prisma.holiday.findMany();

  const startYear = startDate.getFullYear();
  const endYear = endDate.getFullYear();

  const results: { id: string; name: string; date: string }[] = [];

  for (const h of holidays) {
    const [dd, mm] = h.date.split("-").map(Number);
    for (let year = startYear; year <= endYear; year++) {
      const materialized = new Date(year, mm - 1, dd);
      if (materialized >= startDate && materialized <= endDate) {
        const dateStr = `${year}-${h.date.split("-")[1]}-${h.date.split("-")[0]}`;
        results.push({
          id: h.id,
          name: h.name,
          date: dateStr,
        });
      }
    }
  }

  return results.sort((a, b) => a.date.localeCompare(b.date));
}

export async function getHolidayDatesForYear(year: number): Promise<Set<string>> {
  const holidays = await prisma.holiday.findMany();

  const dates = new Set<string>();
  for (const h of holidays) {
    const [dd, mm] = h.date.split("-").map(Number);
    const pad = (n: number) => n.toString().padStart(2, "0");
    dates.add(`${year}-${pad(mm)}-${pad(dd)}`);
  }

  return dates;
}
