"use client";

import { DataTable } from "@/components/common/data-table";
import { useTaskFilters } from "../../hooks/use-task-filters";
import { taskColumns } from "./table-column";
import { TasksToolbar } from "./task-table-toolbar";

export function TasksTable() {
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
  } = useTaskFilters();
  return (
    <DataTable
      columns={taskColumns}
      data={data}
      total={total}
      page={page}
      limit={limit}
      onPageChange={handlePageChange}
      onPageSizeChange={handlePageSizeChange}
      isLoading={isLoading}
      toolbarChildren={
        <TasksToolbar search={search} onSearchChange={handleSearchChange} />
      }
    />
  );
}
