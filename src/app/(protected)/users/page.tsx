"use client"

import { UsersTable } from "@/features/users/components"

export default function Page() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Users</h1>
      <UsersTable />
    </div>
  )
}
