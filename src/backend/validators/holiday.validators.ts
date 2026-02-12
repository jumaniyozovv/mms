import { z } from "zod";

export const createHolidaySchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name too long"),
  date: z.string().regex(/^\d{2}-\d{2}$/, "Invalid date format (DD-MM)"),
});

export const updateHolidaySchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name too long"),
  date: z.string().regex(/^\d{2}-\d{2}$/, "Invalid date format (DD-MM)"),
});

export type CreateHolidaySchemaInput = z.infer<typeof createHolidaySchema>;
export type UpdateHolidaySchemaInput = z.infer<typeof updateHolidaySchema>;
