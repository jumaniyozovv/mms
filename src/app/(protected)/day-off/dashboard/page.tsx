"use client"

import Link from "next/link"
import { Users, CalendarDays, CalendarCheck, ArrowRight } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
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
  const { user, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-gray-500 text-xl">Loading...</p>
      </div>
    )
  }

  const initials = user
    ? `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase()
    : "?"

  return (
    <div className="flex h-full flex-col gap-4">
      <div className="flex flex-1 min-h-0 gap-4">
        <div className="flex flex-1 min-w-0 flex-col gap-4">
          <StatsCards />
          <DayOffCalendar />
        </div>

        <div className="flex w-87.5 flex-col gap-4">
            <Card className="w-full flex flex-col items-center justify-center gap-2">
              <div className="w-full flex items-center justify-start px-4 gap-2">
                <Avatar className="size-12">
                  <AvatarFallback className="text-lg font-semibold">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col gap-2">
                    <p className="text-xl font-medium text-center">
                      {user?.firstName} {user?.lastName}
                    </p>
                  <Button variant="outline" size="sm" asChild className="w-full">
                    <Link href="/day-off/my-requests">
                      My Requests
                      <ArrowRight className="ml-1 size-4" />
                    </Link>
                  </Button>
                </div>

              </div>
              <DayOffUsageChart />
            </Card>
          <PendingDayOffList />
        </div>
      </div>
    </div>
  )
}
