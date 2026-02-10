import type { Table } from "@tanstack/react-table"
import * as XLSX from "xlsx"

function getExportData<TData>(table: Table<TData>) {
  const headers = table
    .getAllColumns()
    .filter((col) => col.getIsVisible() && col.id !== "actions")
    .map((col) => ({
      id: col.id,
      header:
        typeof col.columnDef.header === "string"
          ? col.columnDef.header
          : col.id,
    }))

  const rows = table.getFilteredRowModel().rows.map((row) =>
    headers.reduce(
      (acc, col) => {
        acc[col.header] = row.getValue(col.id) as string
        return acc
      },
      {} as Record<string, string>
    )
  )

  return { headers, rows }
}

export function exportToXlsx<TData>(
  table: Table<TData>,
  filename = "export",
  sheetName = "Sheet1"
) {
  const { rows } = getExportData(table)
  const worksheet = XLSX.utils.json_to_sheet(rows)
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName)
  XLSX.writeFile(workbook, `${filename}.xlsx`)
}

export function exportToCsv<TData>(
  table: Table<TData>,
  filename = "export"
) {
  const { headers, rows } = getExportData(table)
  const headerRow = headers.map((h) => h.header).join(",")
  const csvRows = rows.map((row) =>
    headers
      .map((h) => {
        const value = String(row[h.header] ?? "")
        return value.includes(",") || value.includes('"')
          ? `"${value.replace(/"/g, '""')}"`
          : value
      })
      .join(",")
  )

  const csvContent = [headerRow, ...csvRows].join("\n")
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = `${filename}.csv`
  link.click()
  URL.revokeObjectURL(url)
}
