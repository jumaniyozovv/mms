"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useProjects } from "@/features/projects/hooks/use-projects";
import { CreateTaskDialog } from "../actions/create-task-dialog";
import { useEffect } from "react";

interface BoardToolbarProps {
  search: string;
  onSearchChange: (value: string) => void;
  projectId: string | undefined;
  onProjectChange: (projectId: string | undefined) => void;
}

export function BoardToolbar({
  search,
  onSearchChange,
  projectId,
  onProjectChange,
}: BoardToolbarProps) {
  const { data: projectList, isLoading } = useProjects({ page: 1, limit: 100 });
  const projects = projectList?.data;

  useEffect(() => {
    const stored = localStorage.getItem("project_id");
    if (stored) {
      onProjectChange(stored);
    }
  }, []);

  useEffect(() => {
    if (projectId) {
      localStorage.setItem("project_id", projectId);
    } else {
      localStorage.removeItem("project_id");
    }
  }, [projectId]);

  return (
    <div className="flex items-center justify-between gap-4 flex-wrap">
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <div className="relative max-w-sm w-full">
          <Search className="text-muted-foreground absolute left-2.5 top-1/2 -translate-y-1/2 size-4" />
          <Input
            placeholder="Search by title..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-8"
          />
        </div>

        <Select
          value={projectId ?? "all"}
          onValueChange={(value) =>
            onProjectChange(value === "all" ? undefined : value)
          }
        >
          <SelectTrigger className="w-56">
            <SelectValue
              placeholder={isLoading ? "Loading..." : "All projects"}
            />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All projects</SelectItem>
            {projects?.map((project) => (
              <SelectItem key={project.id} value={project.id}>
                {project.prefix} — {project.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}