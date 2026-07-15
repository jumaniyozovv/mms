import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchProjects,
  createProjectRequest,
  updateProjectRequest,
  deleteProjectRequest,
} from "../services/projects.service";
import type { CreateProjectInput, UpdateProjectInput, ProjectListFilters } from "../types";

const PROJECTS_KEY = ["projects"];

export function useProjects(filters: ProjectListFilters) {
  return useQuery({
    queryKey: [...PROJECTS_KEY, filters],
    queryFn: () => fetchProjects(filters),
  });
}

export function useCreateProject() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateProjectInput) => createProjectRequest(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PROJECTS_KEY });
    }
  });
}

export function useUpdateProject() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateProjectInput }) =>
      updateProjectRequest(id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PROJECTS_KEY });
    }
  });
}

export function useDeleteProject() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteProjectRequest(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PROJECTS_KEY });
    }
    
  });
}