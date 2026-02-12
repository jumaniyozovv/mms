import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import {
  listHolidays,
  listHolidaysInRange,
  createHoliday,
  updateHoliday,
  deleteHoliday,
} from "../services";
import type { CreateHolidayInput, UpdateHolidayInput } from "../types";

export const holidayKeys = {
  all: ["holidays"] as const,
  inRange: (startDate: string, endDate: string) =>
    [...holidayKeys.all, "in-range", startDate, endDate] as const,
};

export function useHolidays() {
  return useQuery({
    queryKey: holidayKeys.all,
    queryFn: listHolidays,
  });
}

export function useHolidaysInRange(startDate: string | null, endDate: string | null) {
  return useQuery({
    queryKey: holidayKeys.inRange(startDate!, endDate!),
    queryFn: () => listHolidaysInRange(startDate!, endDate!),
    enabled: !!startDate && !!endDate,
  });
}

export function useCreateHoliday() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateHolidayInput) => createHoliday(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: holidayKeys.all });
    },
  });
}

export function useUpdateHoliday() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateHolidayInput }) =>
      updateHoliday(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: holidayKeys.all });
    },
  });
}

export function useDeleteHoliday() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteHoliday(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: holidayKeys.all });
    },
  });
}
