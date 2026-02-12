export interface DashboardStats {
  totalUsers: number;
  monthlyRequests: number;
  todaysRequests: number;
}

export interface DayOffListItem {
  id: string;
  userId: string;
  userName: string;
  type: "PAID" | "SICK" | "PERSONAL";
  status: "PENDING" | "APPROVED" | "REJECTED";
  startDate: string;
  endDate: string;
  reason: string | null;
  createdAt: string;
  approvedAt: string | null;
  approverName: string | null;
}

export interface CreateDayOffInput {
  type: "PAID" | "SICK" | "PERSONAL";
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
