import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import {
  listDayOffs,
  createDayOff,
  updateDayOffStatus,
  deleteDayOff,
  getDayOffUsage,
  getMyPendingDayOffs,
  getDashboardStats,
} from "../services";
import type {
  DayOffCalendarFilters,
  CreateDayOffInput,
  UpdateDayOffStatusInput,
} from "../types";

export const dayOffKeys = {
  all: ["day-offs"] as const,
  list: (filters: DayOffCalendarFilters) => [...dayOffKeys.all, "list", filters] as const,
  usage: () => [...dayOffKeys.all, "usage"] as const,
  myPending: () => [...dayOffKeys.all, "my-pending"] as const,
  dashboardStats: () => ["dashboard-stats"] as const,
};

export function useDayOffs(filters: DayOffCalendarFilters | null) {
  return useQuery({
    queryKey: dayOffKeys.list(filters!),
    queryFn: () => listDayOffs(filters!),
    enabled: !!filters,
  });
}

export function useCreateDayOff() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateDayOffInput) => createDayOff(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: dayOffKeys.all });
    },
  });
}

export function useUpdateDayOffStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateDayOffStatusInput }) =>
      updateDayOffStatus(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: dayOffKeys.all });
    },
  });
}

export function useDeleteDayOff() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteDayOff(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: dayOffKeys.all });
    },
  });
}

export function useDayOffUsage() {
  return useQuery({
    queryKey: dayOffKeys.usage(),
    queryFn: getDayOffUsage,
  });
}

export function useMyPendingDayOffs() {
  return useQuery({
    queryKey: dayOffKeys.myPending(),
    queryFn: getMyPendingDayOffs,
    refetchInterval: 30_000,
  });
}

export function useDashboardStats() {
  return useQuery({
    queryKey: dayOffKeys.dashboardStats(),
    queryFn: getDashboardStats,
  });
}
