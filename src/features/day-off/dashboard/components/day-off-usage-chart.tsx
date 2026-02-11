"use client"

import { RadialBarChart, RadialBar, PolarAngleAxis } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, type ChartConfig } from "@/components/ui/chart"
import { useDayOffUsage } from "../hooks"

const chartConfig = {
  paid: { label: "Paid", color: "hsl(142, 71%, 45%)" },
  sick: { label: "Sick", color: "hsl(24, 95%, 53%)" },
  personal: { label: "Personal", color: "hsl(0, 84%, 60%)" },
} satisfies ChartConfig

export function DayOffUsageChart() {
  const { data: usage } = useDayOffUsage()

  if (!usage) return null

  const data = [
    {
      name: "personal",
      value: usage.personalDaysOff > 0 ? (usage.personalUsed / usage.personalDaysOff) * 100 : 0,
      fill: "var(--color-personal)",
    },
    {
      name: "sick",
      value: usage.sickDaysOff > 0 ? (usage.sickUsed / usage.sickDaysOff) * 100 : 0,
      fill: "var(--color-sick)",
    },
    {
      name: "paid",
      value: usage.paidDaysOff > 0 ? (usage.paidUsed / usage.paidDaysOff) * 100 : 0,
      fill: "var(--color-paid)",
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium">Day Off Usage</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-50">
          <RadialBarChart
            innerRadius="30%"
            outerRadius="90%"
            data={data}
            startAngle={90}
            endAngle={-270}
          >
            <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
            <RadialBar
              dataKey="value"
              cornerRadius={6}
              background={{ fill: "hsl(var(--muted))" }}
            />
          </RadialBarChart>
        </ChartContainer>

        <div className="mt-2 space-y-1.5 text-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="size-2.5 rounded-full" style={{ background: chartConfig.paid.color }} />
              <span className="text-muted-foreground">Paid</span>
            </div>
            <span className="font-medium tabular-nums">{usage.paidUsed}/{usage.paidDaysOff}</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="size-2.5 rounded-full" style={{ background: chartConfig.sick.color }} />
              <span className="text-muted-foreground">Sick</span>
            </div>
            <span className="font-medium tabular-nums">{usage.sickUsed}/{usage.sickDaysOff}</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="size-2.5 rounded-full" style={{ background: chartConfig.personal.color }} />
              <span className="text-muted-foreground">Personal</span>
            </div>
            <span className="font-medium tabular-nums">{usage.personalUsed}/{usage.personalDaysOff}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
