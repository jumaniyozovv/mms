"use client"

import { Users, CalendarDays, CalendarCheck } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/shared/providers/AuthProvider"
import {
  DayOffCalendar,
  DayOffUsageChart,
  PendingDayOffList,
} from "@/features/day-off/dashboard/components"
import { useDashboardStats } from "@/features/day-off/dashboard/hooks"

function StatsCards() {
  const { data: stats } = useDashboardStats()

  const cards = [
    {
      title: "Total Users",
      value: stats?.totalUsers ?? "-",
      icon: Users,
    },
    {
      title: "Monthly Requests",
      value: stats?.monthlyRequests ?? "-",
      icon: CalendarDays,
    },
    {
      title: "Today's Requests",
      value: stats?.todaysRequests ?? "-",
      icon: CalendarCheck,
    },
  ]

  return (
    <div className="grid grid-cols-3 gap-4">
      {cards.map((card) => (
        <Card key={card.title}>
          <CardContent>
          <div className="flex flex-row items-center justify-between">
            <p className="text-sm font-medium text-muted-foreground">
              {card.title}
            </p>
            <card.icon className="size-4 text-muted-foreground" />
          </div>
            <p className="text-2xl font-bold  leading-">{card.value}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export default function DayOffDashboard() {
  const { isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-gray-500 text-xl">Loading...</p>
      </div>
    )
  }

  return (
    <div className="flex h-full flex-col gap-4">
      <div className="flex flex-1 min-h-0 gap-4">
        <div className="flex flex-1 min-w-0 flex-col gap-4">
          <StatsCards />
          <DayOffCalendar />
        </div>

        <div className="flex w-87.5 flex-col gap-4">
          <DayOffUsageChart />
          <PendingDayOffList />
        </div>
      </div>
    </div>
  )
}
