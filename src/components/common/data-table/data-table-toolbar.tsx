"use client"

import type { Table } from "@tanstack/react-table"
import { Download, Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { exportToCsv, exportToXlsx } from "./export-utils"

interface DataTableToolbarProps<TData> {
  table: Table<TData>
  searchPlaceholder?: string
  exportFilename?: string
  children?: React.ReactNode
}

export function DataTableToolbar<TData>({
  table,
  searchPlaceholder = "Search...",
  exportFilename = "export",
  children,
}: DataTableToolbarProps<TData>) {
  const globalFilter = table.getState().globalFilter ?? ""

  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex items-center gap-2 flex-1">
        <div className="relative max-w-sm w-full">
          <Search className="text-muted-foreground absolute left-2.5 top-1/2 -translate-y-1/2 size-4" />
          <Input
            placeholder={searchPlaceholder}
            value={globalFilter}
            onChange={(e) => table.setGlobalFilter(e.target.value)}
            className="pl-8"
          />
        </div>
        {children}
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm">
            <Download />
            Export
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            onClick={() => exportToXlsx(table, exportFilename)}
          >
            Export as XLSX
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => exportToCsv(table, exportFilename)}
          >
            Export as CSV
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
