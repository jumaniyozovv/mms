"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { updateTaskSchema, type UpdateTaskFormValues } from "../schema/task.schema";
import { useUpdateTask } from "../hooks/use-tasks";
import { useProjects } from "@/features/projects/hooks/use-projects";
import { useUsers } from "@/features/users/hooks/use-users";
import {
  TaskStatusBadge, TaskPriorityBadge, TaskTypeBadge,
} from "@/components/custom/task-badges";
import { TaskStatusOptions, TaskPriorityOptions, TaskWorkTypeOptions } from "../types";
import type { Task } from "../types";

interface TaskDetailModalProps {
  task: Task | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function TaskDetailModal({ task, open, onOpenChange }: TaskDetailModalProps) {
  const { mutate: updateTask, isPending } = useUpdateTask();
  const { data: projectList } = useProjects({ page: 1, limit: 100 });
  const { data: userList } = useUsers({ page: 1, limit: 100 });

  const form = useForm<UpdateTaskFormValues>({
    resolver: zodResolver(updateTaskSchema),
    defaultValues: task ?? {},
  });

  useEffect(() => {
    if (task && open) {
      form.reset({
        title: task.title,
        description: task.description ?? "",
        type: task.type,
        status: task.status,
        priority: task.priority,
        assigneeId: task.assigneeId ?? "",
        projectId: task.projectId,
        dueDate: task.dueDate ?? "",
      });
    }
  }, [task, open, form]);

  if (!task) return null;

  function onSubmit(values: UpdateTaskFormValues) {
    if(!task)return
    updateTask({ id: task.id, input: values }, { onSuccess: () => onOpenChange(false) });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogTitle>Update task</DialogTitle>
        <DialogHeader>
          <span className="text-xs font-mono text-muted-foreground">{task.key}</span>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl><Input {...field} /></FormControl>
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
                  <FormControl><Textarea {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-3 gap-3">
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                      <SelectContent>
                        {TaskStatusOptions.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>
                            <TaskStatusBadge status={opt.value} />
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="priority"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Priority</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                      <SelectContent>
                        {TaskPriorityOptions.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>
                            <TaskPriorityBadge priority={opt.value} />
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                      <SelectContent>
                        {TaskWorkTypeOptions.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>
                            <TaskTypeBadge type={opt.value} />
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <FormField
                control={form.control}
                name="projectId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                      <SelectContent>
                        {projectList?.data.map((p) => (
                          <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="assigneeId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Assignee</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl><SelectTrigger><SelectValue placeholder="Unassigned" /></SelectTrigger></FormControl>
                      <SelectContent>
                        {userList?.data.map((u) => (
                          <SelectItem key={u.id} value={u.id}>{u.firstName} {u.lastName}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="dueDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Due Date</FormLabel>
                  <FormControl><Input type="date" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

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