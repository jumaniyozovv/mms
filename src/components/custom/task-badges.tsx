import {
  Inbox,
  Circle,
  CircleDot,
  PauseCircle,
  Eye,
  CircleCheck,
  CircleSlash,
  XCircle,
  ArrowDown,
  Equal,
  ArrowUp,
  Flame,
  ListTodo,
  Bug,
  Sparkles,
  SquareCheck,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { TaskPriority, TaskStatus, TaskType } from "@/features/tasks/types";

const statusConfig: Record<
  TaskStatus,
  { label: string; icon: typeof Circle; className: string }
> = {
  BACKLOG: {
    label: "Backlog",
    icon: Inbox,
    className:
      "bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-300",
  },
  TODO: {
    label: "To Do",
    icon: Circle,
    className:
      "bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-300",
  },
  IN_PROGRESS: {
    label: "In Progress",
    icon: CircleDot,
    className:
      "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300",
  },
  PAUSED: {
    label: "Paused",
    icon: PauseCircle,
    className:
      "bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-950 dark:text-yellow-300",
  },
  IN_REVIEW: {
    label: "In Review",
    icon: Eye,
    className:
      "bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-950 dark:text-purple-300",
  },
  DONE: {
    label: "Done",
    icon: CircleCheck,
    className:
      "bg-green-100 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-300",
  },
  BLOCKED: {
    label: "Blocked",
    icon: CircleSlash,
    className:
      "bg-red-100 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-300",
  },
  CANCELLED: {
    label: "Cancelled",
    icon: XCircle,
    className:
      "bg-neutral-100 text-neutral-500 border-neutral-200 dark:bg-neutral-800 dark:text-neutral-400",
  },
};
interface TaskStatusBadgeProps{
status:TaskStatus,
withLabel?:boolean,
withIcon?:boolean,
className?:string
}
export function TaskStatusBadge({ status,withLabel=true, withIcon=false }:TaskStatusBadgeProps ) {
  const { label, icon: Icon, className } = statusConfig[status];
  return (
    <Badge variant="outline" className={cn("gap-1 font-normal", className)}>
      {withIcon && <Icon className="size-3" />}
      {withLabel&&label}
    </Badge>
  );
}

// ---------- Priority ----------

const priorityConfig: Record<
  TaskPriority,
  { label: string; icon: typeof ArrowDown; className: string }
> = {
  LOW: {
    label: "Low",
    icon: ArrowDown,
    className:
      "bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-300",
  },
  MEDIUM: {
    label: "Medium",
    icon: Equal,
    className:
      "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-300",
  },
  HIGH: {
    label: "High",
    icon: ArrowUp,
    className:
      "bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-950 dark:text-orange-300",
  },
  URGENT: {
    label: "Urgent",
    icon: Flame,
    className:
      "bg-red-100 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-300",
  },
};
interface TaskPriorityBadgeProps{
priority:TaskPriority,
withLabel?:boolean,
withIcon?:boolean,
className?:string
}
export function TaskPriorityBadge({ priority,withLabel=true, withIcon=false }: TaskPriorityBadgeProps) {
  const { label, icon: Icon, className } = priorityConfig[priority];
  return (
    <Badge variant="outline" className={cn("gap-1 font-normal ",className)} >
       {withIcon && <Icon className="size-3" />}
      {withLabel&&label}
    </Badge>
  );
}

// ---------- Type ----------

const typeConfig: Record<
  TaskType,
  { label: string; icon: typeof ListTodo; className: string }
> = {
  TASK: {
    label: "Task",
    icon: SquareCheck,
    className:
      "bg-indigo-100 text-indigo-700 border-indigo-200 dark:bg-indigo-950 dark:text-indigo-300",
  },
  BUG: {
    label: "Bug",
    icon: Bug,
    className:
      "bg-rose-100 text-rose-700 border-rose-200 dark:bg-rose-950 dark:text-rose-300",
  },
  FEATURE: {
    label: "Feature",
    icon: Sparkles,
    className:
      "bg-violet-100 text-violet-700 border-violet-200 dark:bg-violet-950 dark:text-violet-300",
  },
};

interface TaskTypeBadgeProps{
type:TaskType,
withLabel?:boolean,
withIcon?:boolean,
}

export function TaskTypeBadge({ type, withLabel=true, withIcon=false }: TaskTypeBadgeProps ) {
  const { label, icon: Icon, className } = typeConfig[type];
  return (
    <Badge variant="outline" className={cn("gap-1 font-normal", className)}>
     {withIcon && <Icon className="size-3" />}
      {withLabel&&label}
    </Badge>
  );
}
