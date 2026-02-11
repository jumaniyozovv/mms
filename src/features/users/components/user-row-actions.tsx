"use client"

import { MoreHorizontal, Pencil, Trash2 } from "lucide-react"

import { useDisclosure } from "@/hooks/use-disclosure"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuth } from "@/shared/providers/AuthProvider"
import { EditUserDialog } from "./edit-user-dialog"
import { DeleteUserDialog } from "./delete-user-dialog"
import type { UserListItem } from "../types"

interface UserRowActionsProps {
  user: UserListItem
}

export function UserRowActions({ user }: UserRowActionsProps) {
  const { user: currentUser } = useAuth()
  const editDialog = useDisclosure()
  const deleteDialog = useDisclosure()

  if (currentUser?.role !== "ADMIN") return null

  const isSelf = currentUser.id === user.id

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="size-8">
            <MoreHorizontal className="size-4" />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={editDialog.onOpen}>
            <Pencil className="size-4 mr-2" />
            Edit
          </DropdownMenuItem>
          {!isSelf && (
            <DropdownMenuItem
              onClick={deleteDialog.onOpen}
              className="text-destructive focus:text-destructive"
            >
              <Trash2 className="size-4 mr-2" />
              Delete
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <EditUserDialog user={user} open={editDialog.open} onOpenChange={editDialog.onOpenChange} />
      {!isSelf && (
        <DeleteUserDialog user={user} open={deleteDialog.open} onOpenChange={deleteDialog.onOpenChange} />
      )}
    </>
  )
}
