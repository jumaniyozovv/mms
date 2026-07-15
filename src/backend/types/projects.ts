import type { ProjectStatus } from "@/app/generated/prisma/enums";

export interface ProjectCreateInput {
  name: string;
  prefix: string;
  description?: string;
  githubUrl?: string;
  status?: ProjectStatus;
}

export interface ProjectUpdateInput {
  name?: string;
  description?: string;
  githubUrl?: string;
  status?: ProjectStatus;
}

export interface ProjectListFilters {
  page: number;
  limit: number;
  search?: string;
  status?: ProjectStatus[];
}