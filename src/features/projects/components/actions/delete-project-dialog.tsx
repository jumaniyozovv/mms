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
import { useDeleteProject } from "../../hooks/use-projects";
import { Project } from "../../types";

interface DeleteProjectDialogProps {
  project: Project;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DeleteProjectDialog({ project, open, onOpenChange }: DeleteProjectDialogProps) {
  const [confirmText, setConfirmText] = useState("");
  const { mutate: deleteProject, isPending } = useDeleteProject();

  const isMatch = confirmText.trim() === project.name;

  function handleDelete() {
    if (!isMatch) return;
    deleteProject(project.id, {
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
          <DialogTitle>Delete Project</DialogTitle>
          <DialogDescription>
            This will also permanently delete every task inside this project. This
            action cannot be undone. Type{" "}
            <span className="font-semibold text-foreground">{project.name}</span> to
            confirm.
          </DialogDescription>
        </DialogHeader>

        <Input
          value={confirmText}
          onChange={(e) => setConfirmText(e.target.value)}
          placeholder={project.name}
          autoComplete="off"
        />

        <DialogFooter>
          <Button variant="outline" onClick={() => handleOpenChange(false)}>
            Cancel
          </Button>
          <Button variant="destructive" disabled={!isMatch || isPending} onClick={handleDelete}>
            {isPending ? "Deleting..." : "Delete Project"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}