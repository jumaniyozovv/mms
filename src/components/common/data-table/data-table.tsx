"use client"

import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type SortingState,
} from "@tanstack/react-table"
import * as React from "react"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { cn } from "@/lib/utils"
import { DataTablePagination } from "./data-table-pagination"
import { Skeleton } from "@/components/ui/skeleton"

interface DataTableProps<TData> {
  columns: ColumnDef<TData, unknown>[]
  data: TData[]
  total: number
  page: number
  limit: number
  onPageChange: (page: number) => void
  onPageSizeChange: (size: number) => void
  isLoading?: boolean
  toolbarChildren?: React.ReactNode
}

export function DataTable<TData>({
  columns,
  data,
  total,
  page,
  limit,
  onPageChange,
  onPageSizeChange,
  isLoading,
  toolbarChildren,
}: DataTableProps<TData>) {
  const [sorting, setSorting] = React.useState<SortingState>([])

  const table = useReactTable({
    data,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    manualPagination: true,
  })

  return (
    <div className="space-y-3">
      {toolbarChildren}

      <div className={cn("rounded-md border overflow-hidden", isLoading && "opacity-50")}>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className={cn(
                      header.column.getCanSort() && "cursor-pointer select-none", "h-10!"
                    )}
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading ?
              Array.from({ length:limit }).map((_, index) => (
                <TableRow key={`skeleton-${index}`}>
                  {columns.map((_, cellIndex) => (
                    <TableCell key={`skeleton-cell-${cellIndex}`}>
                      <Skeleton className="h-5 w-full" />
                    </TableCell>
                  ))}
                </TableRow>
              )) :
              table.getRowModel().rows.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id} className="h-8!">
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center text-muted-foreground"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
          </TableBody>
        </Table>
      </div>

      <DataTablePagination
        page={page}
        limit={limit}
        total={total}
        onPageChange={onPageChange}
        onPageSizeChange={onPageSizeChange}
      />
    </div>
  )
}
