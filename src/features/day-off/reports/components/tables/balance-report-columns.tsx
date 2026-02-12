"use client"

import type { ColumnDef } from "@tanstack/react-table"
import type { UserDayOffBalance } from "@/features/day-off/dashboard/types"

export const balanceReportColumns: ColumnDef<UserDayOffBalance, unknown>[] = [
  {
    accessorKey: "#",
    header: "#",
    cell: (c) => c.row.index + 1
  },
  {
    accessorKey: "userName",
    header: "Employee",
  },
  {
    accessorKey: "paidUsed",
    header: "Paid Used",
    cell: ({ row }) => (
      <span className="tabular-nums">{row.original.paidUsed}</span>
    ),
  },
  {
    accessorKey: "paidTotal",
    header: "Paid Total",
    cell: ({ row }) => (
      <span className="tabular-nums">{row.original.paidTotal}</span>
    ),
  },
  {
    accessorKey: "sickUsed",
    header: "Sick Used",
    cell: ({ row }) => (
      <span className="tabular-nums">{row.original.sickUsed}</span>
    ),
  },
  {
    accessorKey: "sickTotal",
    header: "Sick Total",
    cell: ({ row }) => (
      <span className="tabular-nums">{row.original.sickTotal}</span>
    ),
  },
  {
    accessorKey: "personalUsed",
    header: "Personal Used",
    cell: ({ row }) => (
      <span className="tabular-nums">{row.original.personalUsed}</span>
    ),
  },
  {
    accessorKey: "personalTotal",
    header: "Personal Total",
    cell: ({ row }) => (
      <span className="tabular-nums">{row.original.personalTotal}</span>
    ),
  },
  {
    accessorKey: "totalUsed",
    header: "Total Used",
    cell: ({ row }) => (
      <span className="tabular-nums font-medium">{row.original.totalUsed}</span>
    ),
  },
  {
    accessorKey: "totalLimit",
    header: "Total Limit",
    cell: ({ row }) => (
      <span className="tabular-nums font-medium">{row.original.totalLimit}</span>
    ),
  },
]
