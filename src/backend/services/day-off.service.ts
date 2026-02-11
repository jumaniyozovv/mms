import {
  createDayOff,
  findDayOffById,
  findDayOffsInRange,
  findPendingByUserId,
  findAllPending,
  updateDayOffStatus,
  deleteDayOff,
  countUsedDaysByType,
  findByUserId,
  type DayOffWithUser,
} from "@/backend/repositories/day-off.repository";
import {
  findUserById,
  findAllUsersWithLimits,
} from "@/backend/repositories/user.repository";
import type {
  DayOffListItem,
  CreateDayOffInput,
  DayOffCalendarFilters,
  UpdateDayOffStatusInput,
  DayOffUsage,
  UserDayOffBalance,
} from "@/backend/types/day-off.types";

function toDayOffListItem(dayOff: DayOffWithUser): DayOffListItem {
  return {
    id: dayOff.id,
    userId: dayOff.userId,
    userName: `${dayOff.user.firstName} ${dayOff.user.lastName}`,
    type: dayOff.type,
    status: dayOff.status,
    startDate: dayOff.startDate,
    endDate: dayOff.endDate,
    reason: dayOff.reason,
    createdAt: dayOff.createdAt,
  };
}

export async function createNewDayOff(
  userId: string,
  input: CreateDayOffInput
): Promise<{ data?: DayOffListItem; error?: string }> {
  const user = await findUserById(userId);
  if (!user) return { error: "User not found" };

  const startDate = new Date(input.startDate);
  const endDate = new Date(input.endDate);
  const year = startDate.getFullYear();

  const requestedDays =
    Math.floor((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;

  const usedDays = await countUsedDaysByType(userId, input.type, year);

  let limit: number;
  switch (input.type) {
    case "PAID":
      limit = user.paidDaysOff;
      break;
    case "SICK":
      limit = user.sickDaysOff;
      break;
    case "PERSONAL":
      limit = user.personalDaysOff;
      break;
  }

  if (usedDays + requestedDays > limit) {
    const remaining = limit - usedDays;
    return {
      error: `Not enough ${input.type.toLowerCase()} days off. ${remaining} remaining, ${requestedDays} requested.`,
    };
  }

  const dayOff = await createDayOff({
    userId,
    type: input.type,
    startDate,
    endDate,
    reason: input.reason,
  });

  return { data: toDayOffListItem(dayOff) };
}

export async function listDayOffs(
  filters: DayOffCalendarFilters,
  userId: string,
  role: string
): Promise<DayOffListItem[]> {
  const startDate = new Date(filters.startDate);
  const endDate = new Date(filters.endDate);

  const dayOffs = await findDayOffsInRange(startDate, endDate, userId, role === "ADMIN");
  return dayOffs.map(toDayOffListItem);
}

export async function updateDayOffStatusById(
  id: string,
  input: UpdateDayOffStatusInput
): Promise<{ data?: DayOffListItem; error?: string }> {
  const dayOff = await findDayOffById(id);
  if (!dayOff) return { error: "Day off not found" };
  if (dayOff.status !== "PENDING") return { error: "Can only update pending requests" };

  const updated = await updateDayOffStatus(id, input.status);
  return { data: toDayOffListItem(updated) };
}

export async function deleteOwnDayOff(
  id: string,
  userId: string
): Promise<{ success: boolean; error?: string }> {
  const dayOff = await findDayOffById(id);
  if (!dayOff) return { success: false, error: "Day off not found" };
  if (dayOff.userId !== userId) return { success: false, error: "Not authorized" };
  if (dayOff.status !== "PENDING") return { success: false, error: "Can only delete pending requests" };

  await deleteDayOff(id);
  return { success: true };
}

export async function getPendingDayOffs(
  userId: string,
  role: string
): Promise<DayOffListItem[]> {
  const dayOffs = role === "ADMIN"
    ? await findAllPending()
    : await findPendingByUserId(userId);
  return dayOffs.map(toDayOffListItem);
}

export async function getUserDayOffReport(
  userId: string,
  year: number
): Promise<DayOffListItem[]> {
  const dayOffs = await findByUserId(userId, year);
  return dayOffs.map(toDayOffListItem);
}

export async function getAllUsersBalance(year: number): Promise<UserDayOffBalance[]> {
  const users = await findAllUsersWithLimits();

  const balances = await Promise.all(
    users.map(async (user) => {
      const [paidUsed, sickUsed, personalUsed] = await Promise.all([
        countUsedDaysByType(user.id, "PAID", year),
        countUsedDaysByType(user.id, "SICK", year),
        countUsedDaysByType(user.id, "PERSONAL", year),
      ]);

      return {
        userId: user.id,
        userName: `${user.firstName} ${user.lastName}`,
        paidUsed,
        paidTotal: user.paidDaysOff,
        sickUsed,
        sickTotal: user.sickDaysOff,
        personalUsed,
        personalTotal: user.personalDaysOff,
        totalUsed: paidUsed + sickUsed + personalUsed,
        totalLimit: user.paidDaysOff + user.sickDaysOff + user.personalDaysOff,
      };
    })
  );

  return balances;
}

export async function getUserDayOffUsage(userId: string): Promise<DayOffUsage | null> {
  const user = await findUserById(userId);
  if (!user) return null;

  const year = new Date().getFullYear();

  const [paidUsed, sickUsed, personalUsed] = await Promise.all([
    countUsedDaysByType(userId, "PAID", year),
    countUsedDaysByType(userId, "SICK", year),
    countUsedDaysByType(userId, "PERSONAL", year),
  ]);

  return {
    paidDaysOff: user.paidDaysOff,
    sickDaysOff: user.sickDaysOff,
    personalDaysOff: user.personalDaysOff,
    paidUsed,
    sickUsed,
    personalUsed,
  };
}
