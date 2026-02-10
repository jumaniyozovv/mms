"use client"

import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/shared/providers/AuthProvider"
import { CreateUserDialog } from "./create-user-dialog"

interface UsersToolbarProps {
  search: string
  onSearchChange: (value: string) => void
}

export function UsersToolbar({ search, onSearchChange }: UsersToolbarProps) {
  const { user } = useAuth()

  return (
    <div className="flex items-center justify-between gap-4">
      <div className="relative max-w-sm w-full">
        <Search className="text-muted-foreground absolute left-2.5 top-1/2 -translate-y-1/2 size-4" />
        <Input
          placeholder="Search by name or phone..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-8"
        />
      </div>
      {user?.role === "ADMIN" && <CreateUserDialog />}
    </div>
  )
}
