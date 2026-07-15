import * as React from "react"
import { useDebounce } from "@/hooks/use-debounce"
import type { ProjectListFilters } from "../types"
import { useProjects } from "./use-projects"

export function useProjectFilters(initialLimit = 20) {
  const [filters, setFilters] = React.useState<ProjectListFilters>({
    page: 1,
    limit: initialLimit,
  })
  const [search, setSearch] = React.useState("")

  const debouncedSearch = useDebounce(search, 300)

  const activeFilters = React.useMemo<ProjectListFilters>(
    () => ({
      ...filters,
      search: debouncedSearch || undefined,
    }),
    [filters, debouncedSearch]
  )

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

  const { data, isLoading } = useProjects(activeFilters)

  return {
    data: data?.data ?? [],
    total: data?.total ?? 0,
    isLoading,
    search,
    page: filters.page,
    limit: filters.limit,
    activeFilters,
    handleSearchChange,
    handlePageChange,
    handlePageSizeChange,
  }
}