"use client"

import type { ColumnDef } from "@tanstack/react-table"
import type { UserListItem } from "../types"
import { format } from "date-fns"
import { UserRowActions } from "./user-row-actions"

export const usersColumns: ColumnDef<UserListItem, unknown>[] = [
  {
    accessorKey: "firstName",
    header: "First Name",
  },
  {
    accessorKey: "lastName",
    header: "Last Name",
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
