import { z } from "zod";

export const dayOffConfigSchema = z.object({
  paidDaysOff: z.number().int().min(0).max(365),
  sickDaysOff: z.number().int().min(0).max(365),
  personalDaysOff: z.number().int().min(0).max(365),
});

export type DayOffConfigFormValues = z.infer<typeof dayOffConfigSchema>;
