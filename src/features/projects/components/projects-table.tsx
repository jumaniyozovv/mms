"use client"

import { DataTable } from "@/components/common/data-table"
import { useProjectFilters } from "../hooks/use-project-filters"
import { ProjectsToolbar } from "./projects-toolbar"
import { projectsColumns } from "./projects-column"

export function ProjectsTable() {
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
  } = useProjectFilters()

  return (
    <DataTable
      columns={projectsColumns}
      data={data}
      total={total}
      page={page}
      limit={limit}
      onPageChange={handlePageChange}
      onPageSizeChange={handlePageSizeChange}
      isLoading={isLoading}
      toolbarChildren={
        <ProjectsToolbar search={search} onSearchChange={handleSearchChange} />
      }
    />
  )
}