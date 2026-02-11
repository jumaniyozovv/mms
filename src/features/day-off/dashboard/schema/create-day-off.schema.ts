import { z } from "zod";

export const createDayOffSchema = z
  .object({
    type: z.enum(["PAID", "SICK", "PERSONAL"]),
    startDate: z.string().min(1, "Start date is required"),
    endDate: z.string().min(1, "End date is required"),
    reason: z.string().max(500, "Reason must be at most 500 characters").optional(),
  })
  .refine((data) => data.endDate >= data.startDate, {
    message: "End date must be on or after start date",
    path: ["endDate"],
  });

export type CreateDayOffFormData = z.infer<typeof createDayOffSchema>;
