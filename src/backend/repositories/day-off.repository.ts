import { prisma } from "@/backend/lib/prisma";
import { format, addDays } from "date-fns";
import type { DayOff, DayOffType, DayOffStatus } from "@/app/generated/prisma/client";

export type DayOffWithUser = DayOff & {
  user: { firstName: string; lastName: string };
  approvedBy: { firstName: string; lastName: string } | null;
};

export async function createDayOff(data: {
  userId: string;
  type: DayOffType;
  startDate: Date;
  endDate: Date;
  reason?: string;
}): Promise<DayOffWithUser> {
  return prisma.dayOff.create({
    data: {
      userId: data.userId,
      type: data.type,
      startDate: data.startDate,
      endDate: data.endDate,
      reason: data.reason,
    },
    include: {
      user: { select: { firstName: true, lastName: true } },
      approvedBy: { select: { firstName: true, lastName: true } },
    },
  });
}

export async function findDayOffById(id: string): Promise<DayOffWithUser | null> {
  return prisma.dayOff.findUnique({
    where: { id },
    include: {
      user: { select: { firstName: true, lastName: true } },
      approvedBy: { select: { firstName: true, lastName: true } },
    },
  });
}

export async function findDayOffsInRange(
  startDate: Date,
  endDate: Date,
  userId: string,
  isAdmin: boolean
): Promise<DayOffWithUser[]> {
  return prisma.dayOff.findMany({
    where: {
      startDate: { lte: endDate },
      endDate: { gte: startDate },
      ...(isAdmin
        ? { status: { not: "REJECTED" } }
        : { OR: [{ status: "APPROVED" }, { status: "PENDING", userId }] }),
    },
    include: {
      user: { select: { firstName: true, lastName: true } },
      approvedBy: { select: { firstName: true, lastName: true } },
    },
    orderBy: { startDate: "asc" },
  });
}

export async function updateDayOffStatus(
  id: string,
  status: DayOffStatus,
  approverId: string
): Promise<DayOffWithUser> {
  return prisma.dayOff.update({
    where: { id },
    data: { status, approvedAt: new Date(), approvedById: approverId },
    include: {
      user: { select: { firstName: true, lastName: true } },
      approvedBy: { select: { firstName: true, lastName: true } },
    },
  });
}

export async function deleteDayOff(id: string): Promise<DayOff> {
  return prisma.dayOff.delete({ where: { id } });
}

export async function findPendingByUserId(
  userId: string
): Promise<DayOffWithUser[]> {
  return prisma.dayOff.findMany({
    where: { userId, status: "PENDING" },
    include: {
      user: { select: { firstName: true, lastName: true } },
      approvedBy: { select: { firstName: true, lastName: true } },
    },
    orderBy: { startDate: "asc" },
  });
}

export async function findAllPending(): Promise<DayOffWithUser[]> {
  return prisma.dayOff.findMany({
    where: { status: "PENDING" },
    include: {
      user: { select: { firstName: true, lastName: true } },
      approvedBy: { select: { firstName: true, lastName: true } },
    },
    orderBy: { startDate: "asc" },
  });
}

export async function findByUserId(
  userId: string,
  year: number
): Promise<DayOffWithUser[]> {
  const startOfYear = new Date(year, 0, 1);
  const endOfYear = new Date(year, 11, 31);

  return prisma.dayOff.findMany({
    where: {
      userId,
      startDate: { lte: endOfYear },
      endDate: { gte: startOfYear },
    },
    include: {
      user: { select: { firstName: true, lastName: true } },
      approvedBy: { select: { firstName: true, lastName: true } },
    },
    orderBy: { startDate: "desc" },
  });
}

export async function countDayOffsInMonth(
  year: number,
  month: number
): Promise<number> {
  const startOfMonth = new Date(year, month, 1);
  const endOfMonth = new Date(year, month + 1, 0, 23, 59, 59, 999);

  return prisma.dayOff.count({
    where: {
      createdAt: { gte: startOfMonth, lte: endOfMonth },
    },
  });
}

export async function countDayOffsToday(): Promise<number> {
  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);

  return prisma.dayOff.count({
    where: {
      createdAt: { gte: startOfDay, lte: endOfDay },
    },
  });
}

export async function countUsedDaysByType(
  userId: string,
  type: DayOffType,
  year: number,
  holidayDates?: Set<string>
): Promise<number> {
  const startOfYear = new Date(year, 0, 1);
  const endOfYear = new Date(year, 11, 31);

  const dayOffs = await prisma.dayOff.findMany({
    where: {
      userId,
      type,
      status: { in: ["PENDING", "APPROVED"] },
      startDate: { lte: endOfYear },
      endDate: { gte: startOfYear },
    },
    select: { startDate: true, endDate: true },
  });

  let totalDays = 0;
  for (const d of dayOffs) {
    const start = d.startDate < startOfYear ? startOfYear : d.startDate;
    const end = d.endDate > endOfYear ? endOfYear : d.endDate;

    let current = start;
    while (current <= end) {
      const dateStr = format(current, "yyyy-MM-dd");
      if (!holidayDates || !holidayDates.has(dateStr)) {
        totalDays++;
      }
      current = addDays(current, 1);
    }
  }

  return totalDays;
}
