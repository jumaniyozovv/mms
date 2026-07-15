"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import Link from "next/link";
import { Check, Copy } from "lucide-react";
import { useState } from "react";
import { TaskRowActions } from "./row-actions";
import {
  Task,
  TaskStatusOptions,
  TaskPriorityOptions,
  TaskWorkTypeOptions,
} from "../../types";
import {
  TaskPriorityBadge,
  TaskStatusBadge,
  TaskTypeBadge,
} from "@/components/custom/task-badges";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useUpdateTask } from "../../hooks/use-tasks";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

function TaskKeyCell({ task }: { task: Task }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy(e: React.MouseEvent) {
    e.stopPropagation();
    e.preventDefault();
    const url = `${window.location.origin}/tasks/${task.key}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // silently ignore clipboard failures
    }
  }

  return (
    <div className="flex items-center gap-1 group/key w-fit">
      <Link
        href={`/tasks/${task.key}`}
        className="text-xs font-mono text-muted-foreground hover:text-primary hover:underline transition-colors"
      >
        {task.key}
      </Link>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            type="button"
            onClick={handleCopy}
            className="opacity-0 group-hover/key:opacity-100 transition-opacity text-muted-foreground hover:text-primary"
            aria-label="Copy task URL"
          >
            {copied ? (
              <Check className="size-3" />
            ) : (
              <Copy className="size-3 hover:cursor-pointer" />
            )}
          </button>
        </TooltipTrigger>
        <TooltipContent>Copy url</TooltipContent>
      </Tooltip>
    </div>
  );
}

function StatusCell({ task }: { task: Task }) {
  const { mutate: updateTask } = useUpdateTask();
  return (
    <Select
      value={task.status}
      onValueChange={(value) =>
        updateTask({ id: task.id, input: { status: value as Task["status"] } })
      }
    >
      <SelectTrigger className="h-7 w-fit border-transparent hover:border-input bg-transparent hover:bg-accent/50 transition-colors [&>svg]:hidden px-1">
        <SelectValue>
          <TaskStatusBadge
            status={task.status}
            withIcon={true}
            withLabel={true}
          />
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {TaskStatusOptions.map((opt) => (
          <SelectItem key={opt.value} value={opt.value}>
            <TaskStatusBadge
              status={opt.value}
              withIcon={true}
              withLabel={true}
            />
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

function PriorityCell({ task }: { task: Task }) {
  const { mutate: updateTask } = useUpdateTask();
  return (
    <Select
      value={task.priority}
      onValueChange={(value) =>
        updateTask({
          id: task.id,
          input: { priority: value as Task["priority"] },
        })
      }
    >
      <SelectTrigger className="h-7 w-fit border-transparent hover:border-input bg-transparent hover:bg-accent/50 transition-colors [&>svg]:hidden px-1">
        <SelectValue>
          <TaskPriorityBadge
            priority={task.priority}
            withIcon={true}
            withLabel={true}
          />
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {TaskPriorityOptions.map((opt) => (
          <SelectItem key={opt.value} value={opt.value}>
            <TaskPriorityBadge
              priority={opt.value}
              withIcon={true}
              withLabel={true}
            />
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

function TypeCell({ task }: { task: Task }) {
  const { mutate: updateTask } = useUpdateTask();
  return (
    <Select
      value={task.type}
      onValueChange={(value) =>
        updateTask({ id: task.id, input: { type: value as Task["type"] } })
      }
    >
      <SelectTrigger className="h-7 w-fit border-transparent hover:border-input bg-transparent hover:bg-accent/50 transition-colors [&>svg]:hidden px-1">
        <SelectValue>
          <TaskTypeBadge type={task.type} withIcon={true} withLabel={true} />
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {TaskWorkTypeOptions.map((opt) => (
          <SelectItem key={opt.value} value={opt.value}>
            <TaskTypeBadge type={opt.value} withIcon={true} withLabel={true} />
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export const taskColumns: ColumnDef<Task, unknown>[] = [
  {
    accessorKey: "#",
    header: "#",
    cell: (c) => c.row.index + 1,
  },
  {
    accessorKey: "key",
    header: "Key",
    cell: ({ row }) => <TaskKeyCell task={row.original} />,
  },
  {
    accessorKey: "taskTitle",
    header: "Title",
    cell: ({ row }) => <p>{row.original.title}</p>,
  },
  {
    accessorKey: "desc",
    header: "Description",
    cell: ({ row }) => (
      <p className="max-w-xs truncate">{row.original.description}</p>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <StatusCell task={row.original} />,
  },
  {
    accessorKey: "assignee",
    header: "Assignee",
    cell: ({ row }) => (
      <p>
        {row.original?.assignee?.firstName} {row.original?.assignee?.lastName}
      </p>
    ),
  },
  {
    accessorKey: "priority",
    header: "Priority",
    cell: ({ row }) => <PriorityCell task={row.original} />,
  },
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => <TypeCell task={row.original} />,
  },
  {
    accessorKey: "duedate",
    header: "Due Date",
    cell: ({ row }) =>
      row.original.dueDate
        ? format(new Date(row.original.dueDate), "dd-MM-yyyy")
        : "-",
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
    cell: ({ row }) => format(new Date(row.original.createdAt), "dd-MM-yyyy"),
  },
  {
    id: "actions",
    cell: ({ row }) => <TaskRowActions task={row.original} />,
  },
];
