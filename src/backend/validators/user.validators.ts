import { z } from "zod";

export const createUserSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "Password must contain at least one uppercase letter, one lowercase letter, and one number"
    ),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  phone: z.string(),
  role: z.enum(["ADMIN", "MANAGER", "USER"]),
});

export const userListSchema = z.object({
  page: z.number().int().min(1, "Page must be at least 1"),
  limit: z.number().int().min(1).max(100, "Limit must be between 1 and 100"),
  search: z.string().optional(),
});

export const updateUserSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  phone: z.string().optional(),
  role: z.enum(["ADMIN", "MANAGER", "USER"]),
});

export type CreateUserSchemaInput = z.infer<typeof createUserSchema>;
export type UserListSchemaInput = z.infer<typeof userListSchema>;
export type UpdateUserSchemaInput = z.infer<typeof updateUserSchema>;
