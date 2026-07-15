"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import {
  TaskStatusBadge,
  TaskPriorityBadge,
  TaskTypeBadge,
} from "@/components/custom/task-badges";
import { useTaskByKey } from "../hooks/use-tasks";
import { useDisclosure } from "@/hooks/use-disclosure";
import { EditTaskDialog } from "./actions/edit-task-dialog";
import { useAuth } from "@/shared/providers/AuthProvider";
import { DeleteTaskDialog } from "./actions/delete-task-dialog";

interface TaskDetailPageProps {
  taskKey: string;
}

export function TaskDetailPage({ taskKey }: TaskDetailPageProps) {
  const router = useRouter();
  const { user } = useAuth();
  const { data: task, isLoading, isError } = useTaskByKey(taskKey);
  const editDialog = useDisclosure();
  const deleteDialog = useDisclosure();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (isError || !task) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-3">
        <p className="text-muted-foreground">Task not found.</p>
        <Button variant="outline" size="sm" onClick={() => router.back()}>
          <ArrowLeft className="size-4 mr-2" />
          Go back
        </Button>
      </div>
    );
  }

  const isAssignee = user?.id === task.assigneeId;
  const canEdit = user?.role === "ADMIN" || user?.role === "MANAGER" || isAssignee;
  const canDelete = user?.role === "ADMIN" || user?.role === "MANAGER";

  return (
    <div className="max-w-2xl mx-auto py-6 px-4 space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="sm" onClick={() => router.back()}>
          <ArrowLeft className="size-4 mr-2" />
          Back
        </Button>
        <div className="flex items-center gap-2">
          {canEdit && (
            <Button variant="outline" size="sm" onClick={editDialog.onOpen}>
              Edit
            </Button>
          )}
          {canDelete && (
            <Button variant="destructive" size="sm" onClick={deleteDialog.onOpen}>
              Delete
            </Button>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <span className="text-sm font-mono text-muted-foreground">{task.key}</span>
        <h1 className="text-2xl font-semibold">{task.title}</h1>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        <TaskStatusBadge status={task.status} />
        <TaskPriorityBadge priority={task.priority} />
        <TaskTypeBadge type={task.type} />
      </div>

      {task.description && (
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">Description</p>
          <p className="text-sm whitespace-pre-wrap">{task.description}</p>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4 pt-4 border-t">
        <div>
          <p className="text-xs text-muted-foreground">Project</p>
          <p className="text-sm">{task.project?.name ?? "—"}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Assignee</p>
          <p className="text-sm">
            {task.assignee ? `${task.assignee.firstName} ${task.assignee.lastName}` : "Unassigned"}
          </p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Due Date</p>
          <p className="text-sm">
            {task.dueDate ? format(new Date(task.dueDate), "dd-MM-yyyy") : "—"}
          </p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Created</p>
          <p className="text-sm">{format(new Date(task.createdAt), "dd-MM-yyyy")}</p>
        </div>
      </div>

      {canEdit && (
        <EditTaskDialog task={task} open={editDialog.open} onOpenChange={editDialog.onOpenChange} />
      )}
      {canDelete && (
        <DeleteTaskDialog task={task} open={deleteDialog.open} onOpenChange={deleteDialog.onOpenChange} />
      )}
    </div>
  );
}