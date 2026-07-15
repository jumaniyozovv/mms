"use client"

import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/shared/providers/AuthProvider"
import { CreateProjectDialog } from "./actions/create-project-dialog"

interface ProjectsToolbarProps {
  search: string
  onSearchChange: (value: string) => void
}

export function ProjectsToolbar({ search, onSearchChange }: ProjectsToolbarProps) {
  const { user } = useAuth()
  const canManage = user?.role === "ADMIN" || user?.role === "MANAGER"

  return (
    <div className="flex items-center justify-between gap-4">
      <div className="relative max-w-sm w-full">
        <Search className="text-muted-foreground absolute left-2.5 top-1/2 -translate-y-1/2 size-4" />
        <Input
          placeholder="Search by name..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-8"
        />
      </div>
      {canManage&&<CreateProjectDialog />}
    </div>
  )
}