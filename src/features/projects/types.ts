import type { ProjectStatus } from "@/app/generated/prisma/enums";

export interface Project {
  id: string;
  name: string;
  prefix: string;
  description: string | null;
  githubUrl: string | null;
  status: ProjectStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProjectInput {
  name: string;
  prefix: string;
  description?: string;
  githubUrl?: string;
  status?: ProjectStatus;
}

export interface UpdateProjectInput extends Partial<CreateProjectInput> {}

export interface ProjectListFilters {
  page: number;
  limit: number;
  search?: string;
  status?: ProjectStatus[];
}

export interface ProjectListItem {
  id: string;
  name: string;
}