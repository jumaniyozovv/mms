import { DayOffStatus, DayOffType } from "@/app/generated/prisma/enums";

export interface DashboardStats {
  totalUsers: number;
  monthlyRequests: number;
  todaysRequests: number;
}

export interface DayOffListItem {
  id: string;
  userId: string;
  userName: string;
  type: DayOffType;
  status: DayOffStatus;
  startDate: string;
  endDate: string;
  reason: string | null;
  createdAt: string;
  approvedAt: string | null;
  approverName: string | null;
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
  status: DayOffStatus;
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
