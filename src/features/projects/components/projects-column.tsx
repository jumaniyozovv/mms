"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { ProjectRowActions } from "./project-row-actions";
import type { Project } from "../types";

const statusVariant: Record<Project["status"], string> = {
  ACTIVE: "bg-green-100 text-green-800",
  ON_HOLD: "bg-yellow-100 text-yellow-800",
  COMPLETED: "bg-blue-100 text-blue-800",
  ARCHIVED: "bg-gray-100 text-gray-800",
};

export const projectsColumns: ColumnDef<Project, unknown>[] = [
  {
    accessorKey: "#",
    header: "#",
    cell: (c) => c.row.index + 1,
  },
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => <p className="font-medium">{row.original.name}</p>,
  },
  {
    accessorKey: "key",
    header: "Key",
    cell: ({ row }) => <code className="text-xs text-muted-foreground">{row.original.prefix}</code>,
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => (
      <p className="max-w-xs truncate text-muted-foreground">
        {row.original.description ?? "—"}
      </p>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <Badge className={statusVariant[row.original.status]} variant="secondary">
        {row.original.status.replace("_", " ")}
      </Badge>
    ),
  },
  {
    accessorKey: "githubUrl",
    header: "GitHub",
    cell: ({ row }) =>
      row.original.githubUrl ? (
        <a
          href={row.original.githubUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline text-sm"
        >
          Repo
        </a>
      ) : (
        <span className="text-muted-foreground">—</span>
      ),
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
    cell: ({ row }) => format(new Date(row.original.createdAt), "dd-MM-yyyy"),
  },
  {
    id: "actions",
    cell: ({ row }) => <ProjectRowActions project={row.original} />,
  },
];