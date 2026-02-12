"use client"

import type { ColumnDef } from "@tanstack/react-table"
import { format } from "date-fns"
import type { DayOffListItem } from "@/features/day-off/dashboard/types"
import {
  DayOffTypeBadge,
  DayOffStatusBadge,
} from "@/features/day-off/dashboard/components"

function calcDays(startDate: string, endDate: string): number {
  const diff = new Date(endDate).getTime() - new Date(startDate).getTime()
  return Math.floor(diff / (1000 * 60 * 60 * 24)) + 1
}

export const detailedReportColumns: ColumnDef<DayOffListItem, unknown>[] = [
  {
    accessorKey: "#",
    header: "#",
    cell: (c) => c.row.index + 1
  }, {
    accessorKey: "userName",
    header: "Employee",
  },
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => <DayOffTypeBadge type={row.original.type} />,
  },
  {
    accessorKey: "startDate",
    header: "Start Date",
    cell: ({ row }) => format(new Date(row.original.startDate), "MMM d, yyyy"),
  },
  {
    accessorKey: "endDate",
    header: "End Date",
    cell: ({ row }) => format(new Date(row.original.endDate), "MMM d, yyyy"),
  },
  {
    id: "days",
    header: "Days",
    cell: ({ row }) => (
      <span className="tabular-nums">
        {calcDays(row.original.startDate, row.original.endDate)}
      </span>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <DayOffStatusBadge status={row.original.status} />,
  },
  {
    accessorKey: "reason",
    header: "Reason",
    cell: ({ row }) => (
      <span className="max-w-48 truncate text-muted-foreground block">
        {row.original.reason || "—"}
      </span>
    ),
  },
]
