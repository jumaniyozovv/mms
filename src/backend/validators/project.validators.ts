import { ProjectStatus } from "@/app/generated/prisma/enums";
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
  githubUrl: z.string().url("Must be a valid URL"),
  status: z.enum(ProjectStatus),
});

export const updateProjectSchema = z.object({
  name: z.string().min(1, "Project name is required").max(100).optional(),
  description: z.string().max(1000).optional(),
  githubUrl: z.string().url("Must be a valid URL").optional(),
  status: z.enum(ProjectStatus).optional(),
});

export const projectListSchema = z.object({
  page: z.number().int().min(1, "Page must be at least 1"),
  limit: z.number().int().min(1).max(500, "Limit must be between 1 and 500"),
  search: z.string().optional(),
  status: z.array(z.enum(ProjectStatus)).optional(),
});

export type CreateProjectSchemaInput = z.infer<typeof createProjectSchema>;
export type UpdateProjectSchemaInput = z.infer<typeof updateProjectSchema>;
export type ProjectListSchemaInput = z.infer<typeof projectListSchema>;