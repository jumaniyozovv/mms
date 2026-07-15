import { prisma } from "@/backend/lib/prisma";
import type { Prisma } from "@/app/generated/prisma/client";
import type { TaskListFilters } from "@/backend/types/tasks";
import type { PaginatedResponse } from "@/backend/types/api.types";
import type { Task } from "@/app/generated/prisma/client";

export async function createTaskWithKey(
  data: Omit<Prisma.TaskUncheckedCreateInput, "key">
) {
  return prisma.$transaction(async (tx) => {
    const project = await tx.project.update({
      where: { id: data.projectId },
      data: { taskCounter: { increment: 1 } },
    });

    return tx.task.create({
      data: {
        ...data,
        key: `${project.prefix}-${project.taskCounter}`,
      },
    });
  });
}

export async function findAll(
  filters: TaskListFilters
): Promise<PaginatedResponse<Task>> {
  const { page, limit, search, status, priority, type, assigneeId, projectId, overdue } = filters;

  const where: Prisma.TaskWhereInput = {
    ...(search && {
      OR: [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ],
    }),
    ...(status?.length && { status: { in: status } }),
    ...(priority?.length && { priority: { in: priority } }),
    ...(type?.length && { type: { in: type } }),
    ...(projectId && { projectId }),
    ...(assigneeId === "unassigned"
      ? { assigneeId: null }
      : assigneeId
      ? { assigneeId }
      : {}),
    ...(overdue && {
      dueDate: { lt: new Date() },
      status: { not: "DONE" },
    }),
  };

  const [data, total] = await Promise.all([
    prisma.task.findMany({
      where,
      include: { assignee: true, project: true },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: "desc" },
    }),
    prisma.task.count({ where }),
  ]);

  return { data, total };
}

export function findTaskById(id: string) {
  return prisma.task.findUnique({
    where: { id },
    include: { assignee: true, project: true },
  });
}

export function findTaskByKey(key: string) {
  return prisma.task.findUnique({
    where: { key },
    include: { assignee: true, project: true },
  });
}

export function updateTask(id: string, data: Prisma.TaskUncheckedUpdateInput) {
  return prisma.task.update({ where: { id }, data });
}

export function deleteTask(id: string) {
  return prisma.task.delete({ where: { id } });
}