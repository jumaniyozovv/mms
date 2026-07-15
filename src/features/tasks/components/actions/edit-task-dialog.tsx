"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  updateTaskSchema,
  type UpdateTaskFormValues,
} from "../../schema/task.schema";
import { useUpdateTask } from "../../hooks/use-tasks";
import { useProjects } from "@/features/projects/hooks/use-projects";
import {
  TaskPriorityOptions,
  TaskStatusOptions,
  TaskWorkTypeOptions,
  type Task,
} from "../../types";

import {
  TaskPriorityBadge,
  TaskStatusBadge,
  TaskTypeBadge,
} from "@/components/custom/task-badges";
import { useUsers } from "@/features/users/hooks";

interface UpdateTaskDialogProps {
  task: Task;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditTaskDialog({
  task,
  open,
  onOpenChange,
}: UpdateTaskDialogProps) {
  const { mutate: updateTask, isPending } = useUpdateTask();
  const { data: projectList, isLoading: projectsLoading } = useProjects({
    page: 1,
    limit: 100,
  });

  const projects = projectList?.data;

  const { data: userList, isLoading: usersLoading } = useUsers({
    page: 1,
    limit: 100,
  });
  const users = userList?.data;

  const form = useForm<UpdateTaskFormValues>({
    resolver: zodResolver(updateTaskSchema),
    defaultValues: {
      title: task.title,
      description: task.description ?? undefined,
      type: task.type,
      status: task.status,
      priority: task.priority,
      assigneeId: task.assigneeId ?? undefined,
      projectId: task.projectId ?? undefined,
      dueDate: task.dueDate ?? undefined,
    },
  });

  // Re-sync if the dialog is reopened for the same row after task data changes elsewhere
  useEffect(() => {
    if (open) {
      form.reset({
        title: task.title,
        description: task.description ?? undefined,
        type: task.type,
        status: task.status,
        priority: task.priority,
        assigneeId: task.assigneeId ?? undefined,
        projectId: task.projectId ?? undefined,
        dueDate: task.dueDate ?? undefined,
      });
    }
  }, [open, task, form]);

  function onSubmit(values: UpdateTaskFormValues) {
    updateTask(
      { id: task.id, input: values },
      { onSuccess: () => onOpenChange(false) },
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Task</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue>
                            {field.value && (
                              <TaskTypeBadge type={field.value} />
                            )}
                          </SelectValue>
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {TaskWorkTypeOptions.map((p) => (
                          <SelectItem key={p.value} value={p.value}>
                            <TaskTypeBadge type={p.value} />
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue>
                            {field.value && (
                              <TaskStatusBadge status={field.value} />
                            )}
                          </SelectValue>
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {TaskStatusOptions.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>
                            <TaskStatusBadge status={opt.value} />
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="priority"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Priority</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue>
                            {field.value && (
                              <TaskPriorityBadge priority={field.value} />
                            )}
                          </SelectValue>
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {TaskPriorityOptions.map((p) => {
                          return (
                            <SelectItem key={p.value} value={p.value}>
                              <TaskPriorityBadge priority={p.value} />
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="projectId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue
                            placeholder={
                              projectsLoading ? "Loading..." : "Select"
                            }
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {projects?.map((project) => (
                          <SelectItem key={project.id} value={project.id}>
                            {project.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="assigneeId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Assignee</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue
                            placeholder={
                              usersLoading ? "Loading..." : "Assign to me"
                            }
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {users?.map((u) => (
                          <SelectItem key={u.id} value={u.id}>
                            {u.firstName} {u.lastName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter>
              <Button type="submit" disabled={isPending}>
                {isPending ? "Saving..." : "Save Changes"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
