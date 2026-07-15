"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useDeleteTask } from "../../hooks/use-tasks";
import type { Task } from "../../types";

interface DeleteTaskDialogProps {
  task: Task;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DeleteTaskDialog({ task, open, onOpenChange }: DeleteTaskDialogProps) {
  const [confirmText, setConfirmText] = useState("");
  const { mutate: deleteTask, isPending } = useDeleteTask();

  const isMatch = confirmText.trim() === task.title;

  function handleDelete() {
    if (!isMatch) return;
    deleteTask(task.id, {
      onSuccess: () => {
        setConfirmText("");
        onOpenChange(false);
      },
    });
  }

  function handleOpenChange(next: boolean) {
    if (!next) setConfirmText("");
    onOpenChange(next);
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Delete Task</DialogTitle>
          <DialogDescription>
            This action cannot be undone. Type{" "}
            <span className="font-semibold text-foreground">{task.title}</span> to confirm.
          </DialogDescription>
        </DialogHeader>

        <Input
          value={confirmText}
          onChange={(e) => setConfirmText(e.target.value)}
          placeholder={task.title}
          autoComplete="off"
        />

        <DialogFooter>
          <Button variant="outline" onClick={() => handleOpenChange(false)}>
            Cancel
          </Button>
          <Button variant="destructive" disabled={!isMatch || isPending} onClick={handleDelete}>
            {isPending ? "Deleting..." : "Delete Task"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}