import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getTasks,
  createTaskRequest,
  updateTaskRequest,
  deleteTaskRequest,
  fetchTaskByKey,
  updateTaskStatusRequest,
} from "../services/task.service";
import type { CreateTaskInput, Task, TaskListFilters, UpdateTaskInput } from "../types";
import { TaskStatus } from "@/app/generated/prisma/enums";

const TASKS_KEY = ["tasks"];

export function useTasks(filters:TaskListFilters) {
  return useQuery({ 
    queryKey: [...TASKS_KEY,filters], 
    queryFn: ()=>getTasks(filters) 
  });
}

export function useTaskByKey(key: string) {
  return useQuery({
    queryKey: ["tasks", "by-key", key],
    queryFn: () => fetchTaskByKey(key),
    enabled: !!key,
  });
}

export function useCreateTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateTaskInput) => createTaskRequest(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TASKS_KEY });
    },
  });
}

export function useUpdateTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateTaskInput }) =>
      updateTaskRequest(id, input),

    onMutate: async ({ id, input }) => {
      await queryClient.cancelQueries({ queryKey: TASKS_KEY });
      const previous = queryClient.getQueriesData({ queryKey: TASKS_KEY });

      queryClient.setQueriesData({ queryKey: TASKS_KEY }, (old: any) => {
        if (!old?.data) return old;
        return {
          ...old,
          data: old.data.map((t: Task) => (t.id === id ? { ...t, ...input } : t)),
        };
      });

      return { previous };
    },
    onError: (err, vars, context) => {
      context?.previous?.forEach(([key, data]: [any, any]) => {
        queryClient.setQueryData(key, data);
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: TASKS_KEY });
    },
  });
}

export function useUpdateTaskStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: TaskStatus }) =>
      updateTaskStatusRequest(id, status),

    onMutate: async ({ id, status }) => {
      await queryClient.cancelQueries({ queryKey: TASKS_KEY });
      const previous = queryClient.getQueriesData({ queryKey: TASKS_KEY });

      queryClient.setQueriesData({ queryKey: TASKS_KEY }, (old: any) => {
        if (!old?.data) return old;
        const task = old.data.find((t: Task) => t.id === id);
        if (!task) return old;
        // Move the task to the end of the list so it lands at the bottom of
        // its new column instead of keeping its old array position.
        return {
          ...old,
          data: [
            ...old.data.filter((t: Task) => t.id !== id),
            { ...task, status },
          ],
        };
      });

      return { previous };
    },
    onError: (err, vars, context) => {
      context?.previous?.forEach(([key, data]: [any, any]) => {
        queryClient.setQueryData(key, data);
      });
      // Only refetch on error — invalidating on success re-applies the server
      // sort order and makes the dropped card jump away from where it landed.
      queryClient.invalidateQueries({ queryKey: TASKS_KEY });
    },
  });
}

export function useDeleteTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteTaskRequest(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TASKS_KEY });
    },

  });
}