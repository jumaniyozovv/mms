import { z } from "zod";

export const createDayOffSchema = z
  .object({
    type: z.enum(["PAID", "SICK", "PERSONAL"]),
    startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format"),
    endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format"),
    reason: z.string().max(500).optional(),
  })
  .refine((data) => data.endDate >= data.startDate, {
    message: "End date must be on or after start date",
    path: ["endDate"],
  });

export const dayOffCalendarFilterSchema = z.object({
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format"),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format"),
});

export const updateDayOffStatusSchema = z.object({
  status: z.enum(["APPROVED", "REJECTED"]),
});

export const updateDayOffConfigSchema = z.object({
  paidDaysOff: z.number().int().min(0).max(365),
  sickDaysOff: z.number().int().min(0).max(365),
  personalDaysOff: z.number().int().min(0).max(365),
});

export type CreateDayOffSchemaInput = z.infer<typeof createDayOffSchema>;
export type DayOffCalendarFilterInput = z.infer<typeof dayOffCalendarFilterSchema>;
export type UpdateDayOffStatusSchemaInput = z.infer<typeof updateDayOffStatusSchema>;
export type UpdateDayOffConfigInput = z.infer<typeof updateDayOffConfigSchema>;
