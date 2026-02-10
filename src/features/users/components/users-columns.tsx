"use client"

import type { ColumnDef } from "@tanstack/react-table"
import type { UserListItem } from "../types"
import {format} from "date-fns"

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
    accessorKey: "isActive",
    header: "Status",
    cell: ({ row }) => {
      const isActive = row.original.isActive
      return (
        <span className={isActive ? "text-green-600" : "text-red-500"}>
          {isActive ? "Active" : "Inactive"}
        </span>
      )
    },
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
    cell: ({ row }) =>
      format(row.original.createdAt,"dd-MM-yyyy"),
  },
]
