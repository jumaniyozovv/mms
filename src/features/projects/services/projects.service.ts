import { apiClient } from "@/shared/lib/axios";
import type {
  Project,
  CreateProjectInput,
  UpdateProjectInput,
  ProjectListFilters,
} from "../types";
import type { PaginatedResponse } from "@/backend/types/api.types";

export async function fetchProjects(
  filters: ProjectListFilters
): Promise<PaginatedResponse<Project>> {
  return await apiClient.post("/projects/list", filters);
  
}

export async function createProjectRequest(input: CreateProjectInput): Promise<Project> {
 return  await apiClient.post("/projects", input);
 
}

export async function updateProjectRequest(
  id: string,
  input: UpdateProjectInput
): Promise<Project> {
return await apiClient.put(`/projects/${id}`, input);

}

export async function deleteProjectRequest(id: string): Promise<void> {
  await apiClient.delete(`/projects/${id}`);
}