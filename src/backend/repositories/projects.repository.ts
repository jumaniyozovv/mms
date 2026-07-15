import { prisma } from "@/backend/lib/prisma";
import type { Prisma, Project } from "@/app/generated/prisma/client";
import type { ProjectListFilters } from "@/backend/types/projects";
import type { PaginatedResponse } from "@/backend/types/api.types";

export function createProject(data: Prisma.ProjectUncheckedCreateInput) {
  return prisma.project.create({ data });
}

export async function findAll(
  filters: ProjectListFilters
): Promise<PaginatedResponse<Project>> {
  const { page, limit, search, status } = filters;

  const where: Prisma.ProjectWhereInput = {
    ...(search && {
      OR: [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ],
    }),
    ...(status?.length && { status: { in: status } }),
  };

  const [data, total] = await Promise.all([
    prisma.project.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: "desc" },
    }),
    prisma.project.count({ where }),
  ]);

  return { data, total };
}

export function findProjectById(id: string) {
  return prisma.project.findUnique({ where: { id } });
}

export function updateProject(id: string, data: Prisma.ProjectUncheckedUpdateInput) {
  return prisma.project.update({ where: { id }, data });
}

export function deleteProject(id: string) {
  return prisma.project.delete({ where: { id } });
}