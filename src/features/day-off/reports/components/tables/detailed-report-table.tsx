"use client"

import * as React from "react"
import { DataTable } from "@/components/common/data-table"
import { useMyReport } from "../../hooks"
import { detailedReportColumns } from "./detailed-report-columns"

export function DetailedReportTable({ year }: { year: number }) {
  const { data: records, isLoading } = useMyReport(year)
  const [page, setPage] = React.useState(1)
  const [limit, setLimit] = React.useState(10)

  const allData = records ?? []
  const total = allData.length
  const paged = allData.slice((page - 1) * limit, page * limit)

  function handlePageSizeChange(size: number) {
    setLimit(size)
    setPage(1)
  }

  return (
    <DataTable
      columns={detailedReportColumns}
      data={paged}
      total={total}
      page={page}
      limit={limit}
      onPageChange={setPage}
      onPageSizeChange={handlePageSizeChange}
      isLoading={isLoading}
    />
  )
}
