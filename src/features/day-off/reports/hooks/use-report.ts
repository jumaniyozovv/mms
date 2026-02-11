import { useQuery } from "@tanstack/react-query";
import { getMyReport, getBalance } from "../services";

export function useMyReport(year: number) {
  return useQuery({
    queryKey: ["day-offs", "my-report", year],
    queryFn: () => getMyReport(year),
  });
}

export function useBalance(year: number) {
  return useQuery({
    queryKey: ["day-offs", "balance", year],
    queryFn: () => getBalance(year),
  });
}
