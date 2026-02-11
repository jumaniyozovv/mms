"use client"

import { DataTable } from "@/components/common/data-table"
import { useUserFilters } from "../hooks"
import { usersColumns } from "./users-columns"
import { UsersToolbar } from "./users-toolbar"

export function UsersTable() {
  const {
    search,
    data,
    total,
    isLoading,
    page,
    limit,
    handleSearchChange,
    handlePageChange,
    handlePageSizeChange,
  } = useUserFilters()


  return (
    <DataTable
      columns={usersColumns}
      data={data}
      total={total}
      page={page}
      limit={limit}
      onPageChange={handlePageChange}
      onPageSizeChange={handlePageSizeChange}
      isLoading={isLoading}
      toolbarChildren={
        <UsersToolbar search={search} onSearchChange={handleSearchChange} />
      }
    />
  )
}
