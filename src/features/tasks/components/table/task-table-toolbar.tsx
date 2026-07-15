"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { CreateTaskDialog } from "../actions/create-task-dialog";

interface TasksToolbarProps {
  search: string;
  onSearchChange: (value: string) => void;
}

export function TasksToolbar({ search, onSearchChange }: TasksToolbarProps) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="relative max-w-sm w-full">
        <Search className="text-muted-foreground absolute left-2.5 top-1/2 -translate-y-1/2 size-4" />
        <Input
          placeholder="Search by title..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-8"
        />
      </div>
      <CreateTaskDialog />
    </div>
  );
}
