"use client";

import { useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TaskType, TaskPriority } from "@/app/generated/prisma/enums";
import { TaskPriorityOptions, TaskWorkTypeOptions } from "../../types";
import { useCreateTask } from "../../hooks/use-tasks";
import type { TaskStatus } from "../../types";
import { TaskPriorityBadge, TaskTypeBadge } from "@/components/custom/task-badges";

const inlineTaskSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  type: z.nativeEnum(TaskType),
  priority: z.nativeEnum(TaskPriority),
  dueDate: z.string().optional(),
});

type InlineTaskFormValues = z.infer<typeof inlineTaskSchema>;

interface InlineCreateTaskFormProps {
  status: TaskStatus;
  projectId: string;
  onDone: () => void;
}

export function InlineCreateTaskForm({ status, projectId, onDone }: InlineCreateTaskFormProps) {
  const { mutate: createTask, isPending } = useCreateTask();
  const titleRef = useRef<HTMLInputElement>(null);

  const form = useForm<InlineTaskFormValues>({
    resolver: zodResolver(inlineTaskSchema),
    defaultValues: {
      title: "",
      type: TaskType.TASK,
      priority: TaskPriority.MEDIUM,
      dueDate: "",
    },
  });

  useEffect(() => {
    titleRef.current?.focus();
  }, []);

  function onSubmit(values: InlineTaskFormValues) {
    createTask(
      { ...values, status, projectId },
      {
        onSuccess: () => {
          form.reset();
          titleRef.current?.focus();
        },
      }
    );
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Escape") onDone();
    if (e.key === "Enter" && !e.shiftKey && document.activeElement === titleRef.current) {
      e.preventDefault();
      form.handleSubmit(onSubmit)();
    }
  }

  const type = form.watch("type");
  const priority = form.watch("priority");

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      onKeyDown={handleKeyDown}
      className="rounded-md border bg-background p-2 space-y-2 shadow-sm"
    >
      <Input
        {...form.register("title")}
        ref={(el) => {
          form.register("title").ref(el);
          titleRef.current = el;
        }}
        placeholder="Task title..."
        className="h-7 border-none shadow-none px-1 text-sm focus-visible:ring-0"
      />

      <div className="flex items-center">
        <Select value={type} onValueChange={(v) => form.setValue("type", v as TaskType)}>
          <SelectTrigger className="w-fit p-0! justify-center border-transparent hover:bg-accent [&>svg]:hidden">
            <SelectValue>
              <TaskTypeBadge type={type} withIcon withLabel={false} />
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {TaskWorkTypeOptions.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                <TaskTypeBadge type={opt.value} withIcon withLabel />
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={priority} onValueChange={(v) => form.setValue("priority", v as TaskPriority)}>
          <SelectTrigger className="w-fit p-0 justify-center border-transparent hover:bg-accent [&>svg]:hidden">
            <SelectValue>
              <TaskPriorityBadge priority={priority} withIcon withLabel={false} />
            </SelectValue>
          </SelectTrigger>
          <SelectContent className="w-fit">
            {TaskPriorityOptions.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                <TaskPriorityBadge priority={opt.value} withIcon withLabel />
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Input
          type="date"
          {...form.register("dueDate")}
          className="h-7 border-none shadow-none px-1 text-xs text-muted-foreground focus-visible:ring-0 w-auto ml-auto"
        />
      </div>

      <div className="flex justify-end gap-1.5 pt-1 border-t">
        <Button type="button" variant="ghost" size="sm" className="h-6 text-xs" onClick={onDone}>
          Cancel
        </Button>
        <Button type="submit" size="sm" className="h-6 text-xs" disabled={isPending}>
          {isPending ? "Adding..." : "Add"}
        </Button>
      </div>
    </form>
  );
}