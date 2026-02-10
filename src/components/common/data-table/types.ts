import type { ColumnDef } from "@tanstack/react-table"

export interface DataTableProps<TData> {
  columns: ColumnDef<TData, unknown>[]
  data: TData[]
  searchPlaceholder?: string
  searchColumn?: string
  pageSizeOptions?: number[]
  toolbarChildren?: React.ReactNode
}

export interface ExportConfig {
  filename: string
  sheetName?: string
}
