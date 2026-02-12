import { z } from "zod";

export const holidaySchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name too long"),
  day: z.string().min(1, "Day is required"),
  month: z.string().min(1, "Month is required"),
});

export type HolidayFormData = z.infer<typeof holidaySchema>;
