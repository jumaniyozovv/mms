"use client"

import * as React from "react"
import { DataTable } from "@/components/common/data-table"
import { useDebounce } from "@/hooks/use-debounce"
import { useUsers } from "../hooks"
import { usersColumns } from "./users-columns"
import { UsersToolbar } from "./users-toolbar"
import type { UserListFilters } from "../types"

export function UsersTable() {
  const [filters, setFilters] = React.useState<UserListFilters>({
    page: 1,
    limit: 20,
  })
  const [search, setSearch] = React.useState("")

  const debouncedSearch = useDebounce(search, 300)

  const activeFilters = React.useMemo<UserListFilters>(
    () => ({
      ...filters,
      search: debouncedSearch || undefined,
    }),
    [filters, debouncedSearch]
  )

  const { data, isLoading } = useUsers(activeFilters)

  const total = data?.total ?? 0

  function handleSearchChange(value: string) {
    setSearch(value)
    setFilters((prev) => ({ ...prev, page: 1 }))
  }

  function handlePageChange(page: number) {
    setFilters((prev) => ({ ...prev, page }))
  }

  function handlePageSizeChange(limit: number) {
    setFilters((prev) => ({ ...prev, limit, page: 1 }))
  }

  return (
    <DataTable
      columns={usersColumns}
      data={data?.data ?? []}
      total={total}
      page={filters.page}
      limit={filters.limit}
      onPageChange={handlePageChange}
      onPageSizeChange={handlePageSizeChange}
      isLoading={isLoading}
      toolbarChildren={
        <UsersToolbar search={search} onSearchChange={handleSearchChange} />
      }
    />
  )
}
