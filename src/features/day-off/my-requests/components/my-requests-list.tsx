"use client"

import { format } from "date-fns"
import { Skeleton } from "@/components/ui/skeleton"
import { useMyReport } from "@/features/day-off/reports/hooks/use-report"
import {
  DayOffTypeBadge,
  DayOffStatusBadge,
} from "@/features/day-off/dashboard/components"

export function MyRequestsList({ year }: { year: number }) {
  const { data: records, isLoading } = useMyReport(year)

  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 border-b pb-3">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-5 w-16" />
            <Skeleton className="h-5 w-16" />
          </div>
        ))}
      </div>
    )
  }

  if (!records?.length) {
    return (
      <p className="text-center text-muted-foreground py-8">No requests found.</p>
    )
  }

  return (
    <div>
      {records.map((item) => (
        <div
          key={item.id}
          className="flex items-center gap-4 border-b last:border-none py-3"
        >
          <span className="text-sm font-medium">{item.userName}</span>
          <span className="text-sm text-muted-foreground">
            {format(new Date(item.startDate), "MMM d")}–{format(new Date(item.endDate), "MMM d")}
          </span>
          <DayOffTypeBadge type={item.type} />
          <DayOffStatusBadge status={item.status} />
        </div>
      ))}
    </div>
  )
}
