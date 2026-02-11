"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Cell } from "recharts"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { useDayOffUsage } from "@/features/day-off/dashboard/hooks"
import { DetailedReportTable } from "../tables"

const TYPE_COLORS = {
  Paid: "hsl(142, 71%, 45%)",
  Sick: "hsl(24, 95%, 53%)",
  Personal: "hsl(0, 84%, 60%)",
} as const

const chartConfig = {
  used: { label: "Used", color: "hsl(142, 71%, 45%)" },
} satisfies ChartConfig

export function DetailedReport() {
  const year = new Date().getFullYear()
  const { data: usage } = useDayOffUsage()

  const chartData = usage
    ? [
        { type: "Paid", used: usage.paidUsed },
        { type: "Sick", used: usage.sickUsed },
        { type: "Personal", used: usage.personalUsed },
      ]
    : []

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">Detailed Report</h1>

      {usage && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">
              Used Days ({year})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-64 w-full">
              <BarChart data={chartData}>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="type" tickLine={false} axisLine={false} />
                <YAxis allowDecimals={false} tickLine={false} axisLine={false} />
                <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                <Bar dataKey="used" radius={[4, 4, 0, 0]} barSize={40}>
                  {chartData.map((entry) => (
                    <Cell
                      key={entry.type}
                      fill={TYPE_COLORS[entry.type as keyof typeof TYPE_COLORS]}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      )}

      <DetailedReportTable year={year} />
    </div>
  )
}
