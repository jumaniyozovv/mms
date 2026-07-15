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
import type { Project } from "../types"
import { EditProjectDialog } from "./actions/edite-project-dialog"
import { DeleteProjectDialog } from "./actions/delete-project-dialog"

interface ProjectRowActionsProps {
  project: Project
}

export function ProjectRowActions({ project }: ProjectRowActionsProps) {
  const { user } = useAuth()
  const editDialog = useDisclosure()
  const deleteDialog = useDisclosure()

  const canManage = user?.role === "ADMIN" || user?.role === "MANAGER"
  if (!canManage) return null

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
          <DropdownMenuItem
            onClick={deleteDialog.onOpen}
            className="text-destructive focus:text-destructive"
          >
            <Trash2 className="size-4 mr-2" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <EditProjectDialog project={project} open={editDialog.open} onOpenChange={editDialog.onOpenChange} />
      <DeleteProjectDialog project={project} open={deleteDialog.open} onOpenChange={deleteDialog.onOpenChange} />
    </>
  )
}