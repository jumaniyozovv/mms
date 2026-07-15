"use client";

import Link from "next/link";
import { CSS } from "@dnd-kit/utilities";
import { cn } from "@/lib/utils";
import {
  TaskPriorityBadge,
  TaskTypeBadge,
} from "@/components/custom/task-badges";
import type { Task } from "../../types";
import { Check, CircleUser, Copy } from "lucide-react";
import { useSortable } from "@dnd-kit/sortable";
import { useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { SearchableSelect } from "@/components/common/searchable-select";
import { useUsers } from "@/features/users/hooks";
import { useUpdateTask } from "../../hooks/use-tasks";

interface TaskCardProps {
  task: Task;
  onTaskClick?: (task: Task) => void;
}

export function TaskCard({ task, onTaskClick }: TaskCardProps) {
  const [copied, setCopied] = useState(false);
  const { data: users } = useUsers({ page: 1, limit: 200 });
  const { mutate: updateTask } = useUpdateTask();
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  function handleClick() {
    onTaskClick?.(task);
  }

  async function handleCopyUrl(e: React.MouseEvent) {
    e.stopPropagation();
    e.preventDefault(); // don't follow the link when just copying
    const url = `${window.location.origin}/tasks/${task.key}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // clipboard write failed silently — optionally wire a toast here
    }
  }

  const userOptions =
    users?.data.map((u) => ({
      value: u.id,
      label: `${u.firstName} ${u.lastName}`,
    })) ?? [];

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      onClick={handleClick}
      className={cn(
        "rounded-md border bg-background p-3 shadow-sm",
        isDragging ? "cursor-grabbing opacity-50 z-10" : "cursor-pointer",
      )}
    >
      <div className="flex items-center gap-1 group/key w-fit">
        <Link
          href={`/tasks/${task.key}`}
          onClick={(e) => e.stopPropagation()} // open the page, don't also trigger the card's modal click
          className="text-xs font-mono text-muted-foreground hover:text-primary hover:underline transition-colors"
        >
          {task.key}
        </Link>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              type="button"
              onClick={handleCopyUrl}
              className="opacity-0 group-hover/key:opacity-100 transition-opacity text-muted-foreground hover:text-primary"
              aria-label="Copy task URL"
            >
              {copied ? (
                <Check className="size-3" />
              ) : (
                <Copy className="size-3" />
              )}
            </button>
          </TooltipTrigger>
          <TooltipContent>Copy url</TooltipContent>
        </Tooltip>
      </div>
      <p className="text-sm font-medium mt-1 line-clamp-2">{task.title}</p>
      <div className="flex items-center justify-between gap-1.5 flex-wrap">
        <div className="flex gap-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <div>
                <TaskTypeBadge
                  type={task.type}
                  withIcon={true}
                  withLabel={false}
                />
              </div>
            </TooltipTrigger>
            <TooltipContent>{task.type}</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <div>
                <TaskPriorityBadge
                  priority={task.priority}
                  withIcon={true}
                  withLabel={false}
                />
              </div>
            </TooltipTrigger>
            <TooltipContent>{task.priority}</TooltipContent>
          </Tooltip>
        </div>

        <SearchableSelect
          options={userOptions}
          value={task.assigneeId ?? undefined}
          onChange={(val) =>
            updateTask({ id: task.id, input: { assigneeId: val } })
          }
          searchPlaceholder="Search users..."
          emptyText="No users found"
          trigger={
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={(e) => e.stopPropagation()}
                  className="text-muted-foreground hover:text-primary"
                >
                  {task.assignee ? (
                    <p className="text-xs flex">
                      {task.assignee.firstName[0].toUpperCase()}
                      {task.assignee.lastName[0].toUpperCase()}
                    </p>
                  ) : (
                    <CircleUser size={20} />
                  )}
                </button>
              </TooltipTrigger>{" "}
              <TooltipContent>
                {task.assignee
                  ? `${task.assignee.firstName} ${task.assignee.lastName}`
                  : "Unassigned"}
              </TooltipContent>
            </Tooltip>
          }
        />
      </div>
    </div>
  );
}
