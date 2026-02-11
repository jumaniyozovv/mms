"use client"

import * as React from "react"
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  addMonths,
  subMonths,
  isWithinInterval,
} from "date-fns"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { useMyReport } from "../../hooks"

const chartConfig = {
  dayOff: { label: "Day Off", color: "hsl(217, 91%, 60%)" },
} satisfies ChartConfig

export function MonthlyReport() {
  const [month, setMonth] = React.useState(() => startOfMonth(new Date()))
  const year = month.getFullYear()
  const { data: records } = useMyReport(year)

  const days = eachDayOfInterval({
    start: startOfMonth(month),
    end: endOfMonth(month),
  })

  const chartData = days.map((day) => {
    const hasDay = records?.some((r) => {
      if (r.status === "REJECTED") return false
      return isWithinInterval(day, {
        start: new Date(r.startDate),
        end: new Date(r.endDate),
      })
    })

    return {
      day: format(day, "d"),
      dayOff: hasDay ? 1 : 0,
    }
  })

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">Monthly Report</h1>

      <Card>
        <CardHeader className="flex-row items-center justify-between space-y-0">
          <CardTitle className="text-sm font-medium">
            {format(month, "MMMM yyyy")}
          </CardTitle>
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon-sm"
              onClick={() => setMonth((m) => subMonths(m, 1))}
            >
              <ChevronLeft />
            </Button>
            <Button
              variant="outline"
              size="icon-sm"
              onClick={() => setMonth((m) => addMonths(m, 1))}
            >
              <ChevronRight />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-64 w-full">
            <BarChart data={chartData}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="day"
                tickLine={false}
                axisLine={false}
                fontSize={11}
              />
              <YAxis
                domain={[0, 1]}
                ticks={[0, 1]}
                tickLine={false}
                axisLine={false}
                allowDecimals={false}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent />}
              />
              <Bar
                dataKey="dayOff"
                fill="var(--color-dayOff)"
                radius={[3, 3, 0, 0]}
              />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  )
}
