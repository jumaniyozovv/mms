import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getDayOffConfig, updateDayOffConfig } from "../services";
import type { DayOffConfig } from "../types";

export const dayOffConfigKeys = {
  all: ["day-off-config"] as const,
};

export function useDayOffConfig() {
  return useQuery({
    queryKey: dayOffConfigKeys.all,
    queryFn: getDayOffConfig,
  });
}

export function useUpdateDayOffConfig() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: DayOffConfig) => updateDayOffConfig(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: dayOffConfigKeys.all });
    },
  });
}
