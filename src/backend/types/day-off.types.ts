import type { DayOffType, DayOffStatus } from "@/app/generated/prisma/client";

export interface DayOffListItem {
  id: string;
  userId: string;
  userName: string;
  type: DayOffType;
  status: DayOffStatus;
  startDate: Date;
  endDate: Date;
  reason: string | null;
  createdAt: Date;
}

export interface CreateDayOffInput {
  type: DayOffType;
  startDate: string;
  endDate: string;
  reason?: string;
}

export interface DayOffCalendarFilters {
  startDate: string;
  endDate: string;
}

export interface UpdateDayOffStatusInput {
  status: "APPROVED" | "REJECTED";
}

export interface DayOffUsage {
  paidDaysOff: number;
  sickDaysOff: number;
  personalDaysOff: number;
  paidUsed: number;
  sickUsed: number;
  personalUsed: number;
}

export interface UserDayOffBalance {
  userId: string;
  userName: string;
  paidUsed: number;
  paidTotal: number;
  sickUsed: number;
  sickTotal: number;
  personalUsed: number;
  personalTotal: number;
  totalUsed: number;
  totalLimit: number;
}
