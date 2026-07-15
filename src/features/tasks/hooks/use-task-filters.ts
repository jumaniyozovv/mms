import * as React from "react"
import { useDebounce } from "@/hooks/use-debounce"
import type { TaskListFilters, TaskStatus, TaskPriority, TaskType } from "../types"
import { useTasks } from "./use-tasks"

export function useTaskFilters(initialLimit = 20) {
// inside useTaskFilters, or wherever projectId's state actually lives
  const [filters, setFilters] = React.useState<TaskListFilters>({
    page: 1,
    limit: initialLimit,
  })
  const [search, setSearch] = React.useState("")

  const debouncedSearch = useDebounce(search, 300)

  const activeFilters = React.useMemo<TaskListFilters>(
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

  function handleStatusChange(status: TaskStatus[] | undefined) {
    setFilters((prev) => ({ ...prev, status, page: 1 }))
  }

  function handlePriorityChange(priority: TaskPriority[] | undefined) {
    setFilters((prev) => ({ ...prev, priority, page: 1 }))
  }

  function handleTypeChange(type: TaskType[] | undefined) {
    setFilters((prev) => ({ ...prev, type, page: 1 }))
  }

  function handleAssigneeChange(assigneeId: string | undefined) {
    setFilters((prev) => ({ ...prev, assigneeId, page: 1 }))
  }

  function handleProjectChange(projectId: string | undefined) {
    setFilters((prev) => ({ ...prev, projectId, page: 1 }))
  }

  function handleOverdueChange(overdue: boolean | undefined) {
    setFilters((prev) => ({ ...prev, overdue, page: 1 }))
  }

  const { data, isLoading } = useTasks(activeFilters)

  return {
    data: data?.data ?? [],
    total: data?.total ?? 0,
    isLoading,
    search,
    page: filters.page,
    limit: filters.limit,
    status: filters.status,
    priority: filters.priority,
    type: filters.type,
    assigneeId: filters.assigneeId,
    projectId: filters.projectId,
    overdue: filters.overdue,
    activeFilters,
    handleSearchChange,
    handlePageChange,
    handlePageSizeChange,
    handleStatusChange,
    handlePriorityChange,
    handleTypeChange,
    handleAssigneeChange,
    handleProjectChange,
    handleOverdueChange,
  }
}