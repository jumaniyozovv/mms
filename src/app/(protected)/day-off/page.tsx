"use client"

import { DayOffCalendar, DayOffUsageChart, PendingDayOffList } from "@/features/day-off/dashboard/components"

export default function Page() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
      <DayOffCalendar />
      <div className="space-y-4">
        <DayOffUsageChart />
        <PendingDayOffList />
      </div>
    </div>
  )
}
