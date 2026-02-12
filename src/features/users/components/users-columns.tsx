"use client"

import type { ColumnDef } from "@tanstack/react-table"
import { format } from "date-fns"
import type { UserListItem } from "../types"
import { UserRowActions } from "./user-row-actions"

export const usersColumns: ColumnDef<UserListItem, unknown>[] = [
  {
    accessorKey: "#",
    header: "#",
    cell: (c) => c.row.index + 1
  },
  {
    accessorKey: "fullName",
    header: "Full Name",
    cell: ({ row }) =>
      <p>{row.original.firstName} {row.original.lastName}</p>
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "phone",
    header: "Phone",
    cell: ({ row }) => row.original.phone || "—",
  },
  {
    accessorKey: "role",
    header: "Role",
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
    cell: ({ row }) =>
      format(row.original.createdAt, "dd-MM-yyyy"),
  },
  {
    id: "actions",
    cell: ({ row }) => <UserRowActions user={row.original} />,
  },
]
