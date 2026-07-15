"use client";

import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";

import { useDisclosure } from "@/hooks/use-disclosure";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/shared/providers/AuthProvider";
import type { Task } from "../../types";
import { EditTaskDialog } from "../actions/edit-task-dialog";
import { DeleteTaskDialog } from "../actions/delete-task-dialog";

interface TaskRowActionsProps {
  task: Task;
}

export function TaskRowActions({ task }: TaskRowActionsProps) {
  const { user: currentUser } = useAuth();
  const editDialog = useDisclosure();
  const deleteDialog = useDisclosure();

  if (!currentUser) return null;

  const isAssignee = currentUser.id === task.assigneeId;
  const canEdit =
    currentUser.role === "ADMIN" ||
    currentUser.role === "MANAGER" ||
    isAssignee;
  const canDelete =
    currentUser.role === "ADMIN" || currentUser.role === "MANAGER";

  if (!canEdit && !canDelete) return null;

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="size-8">
            <MoreHorizontal className="size-4" />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {canEdit && (
            <DropdownMenuItem onClick={editDialog.onOpen}>
              <Pencil className="size-4 mr-2" />
              Edit
            </DropdownMenuItem>
          )}
          {canDelete && (
            <DropdownMenuItem
              onClick={deleteDialog.onOpen}
              className="text-destructive focus:text-destructive"
            >
              <Trash2 className="size-4 mr-2" />
              Delete
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {canEdit && (
        <EditTaskDialog
          task={task}
          open={editDialog.open}
          onOpenChange={editDialog.onOpenChange}
        />
      )}
      {canDelete && (
        <DeleteTaskDialog
          task={task}
          open={deleteDialog.open}
          onOpenChange={deleteDialog.onOpenChange}
        />
      )}
    </>
  );
}
