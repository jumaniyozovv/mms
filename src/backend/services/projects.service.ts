import {
  createProject as createProjectInDb,
  updateProject as updateProjectInDb,
  deleteProject as deleteProjectInDb,
  findAll,
  findProjectById,
} from "../repositories/projects.repository";
import type {
  ProjectCreateInput,
  ProjectUpdateInput,
  ProjectListFilters,
} from "../types/projects";

export async function createProject(data: ProjectCreateInput) {

  return createProjectInDb({
    name: data.name,
    prefix: data.prefix,
    description: data.description,
    githubUrl: data.githubUrl,
    status: data.status,
  });
}

// export async function updateProject(id: string, data: ProjectUpdateInput, role: UserRole) {
//   if (!canManageProjects(role)) {
//     throw new Error("Not allowed to update projects");
//   }
export async function updateProject(id: string, data: ProjectUpdateInput) {
  
  const project = await findProjectById(id);
  if (!project) throw new Error("Project not found");

  return updateProjectInDb(id, data);
}

export async function deleteProject(id: string) {

  const project = await findProjectById(id);
  if (!project) throw new Error("Project not found");

  return deleteProjectInDb(id);
}

export async function getProjects(filters: ProjectListFilters) {
  return findAll(filters); // reading the list stays open to everyone — USER needs this for the task dropdown
}