import { z } from "zod";

const prefixRegex = /^[A-Z]{2,6}$/;


export const createProjectSchema = z.object({
  name: z.string().min(1, "Project name is required").max(100),
  prefix: z
    .string()
    .min(2, "Prefix must be 2-6 letters")
    .max(6, "Prefix must be 2-6 letters")
    .regex(prefixRegex, "Uppercase letters only"),
  description: z.string().max(1000).optional(),
  githubUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  status: z.enum(["ACTIVE", "ON_HOLD", "COMPLETED", "ARCHIVED"]).optional(),
});


export const updateProjectSchema = z.object({
  name: z.string().min(1, "Project name is required").max(100).optional(),
  description: z.string().max(1000).optional(),
  githubUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  status: z.enum(["ACTIVE", "ON_HOLD", "COMPLETED", "ARCHIVED"]).optional(),
});

export type UpdateProjectFormValues = z.infer<typeof updateProjectSchema>;

export type CreateProjectFormValues = z.infer<typeof createProjectSchema>;