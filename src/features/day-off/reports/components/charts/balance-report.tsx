"use client"

import { RadialBarChart, RadialBar, PolarAngleAxis } from "recharts"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, type ChartConfig } from "@/components/ui/chart"
import { useDayOffUsage } from "@/features/day-off/dashboard/hooks"
import { BalanceReportTable } from "../tables"

const types = [
  { key: "paid", label: "Paid", color: "hsl(142, 71%, 45%)" },
  { key: "sick", label: "Sick", color: "hsl(24, 95%, 53%)" },
  { key: "personal", label: "Personal", color: "hsl(0, 84%, 60%)" },
] as const

function getUsage(
  usage: { paidUsed: number; paidDaysOff: number; sickUsed: number; sickDaysOff: number; personalUsed: number; personalDaysOff: number },
  key: "paid" | "sick" | "personal"
) {
  const map = {
    paid: { used: usage.paidUsed, total: usage.paidDaysOff },
    sick: { used: usage.sickUsed, total: usage.sickDaysOff },
    personal: { used: usage.personalUsed, total: usage.personalDaysOff },
  }
  return map[key]
}

export function BalanceReport() {
  const year = new Date().getFullYear()
  const { data: usage } = useDayOffUsage()

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">Balance Report</h1>

      {usage && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">
              Day Off Balance ({year})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              {types.map((t) => {
                const { used, total } = getUsage(usage, t.key)
                const pct = total > 0 ? (used / total) * 100 : 0

                const config = {
                  value: { label: t.label, color: t.color },
                } satisfies ChartConfig

                return (
                  <div key={t.key} className="flex flex-col items-center">
                    <div className="relative aspect-square w-full max-w-36">
                      <ChartContainer config={config} className="size-full">
                        <RadialBarChart
                          innerRadius="75%"
                          outerRadius="100%"
                          data={[{ value: pct, fill: "var(--color-value)" }]}
                          startAngle={90}
                          endAngle={-270}
                        >
                          <PolarAngleAxis
                            type="number"
                            domain={[0, 100]}
                            angleAxisId={0}
                            tick={false}
                          />
                          <RadialBar
                            dataKey="value"
                            cornerRadius={8}
                            background={{ fill: "hsl(var(--muted))" }}
                          />
                        </RadialBarChart>
                      </ChartContainer>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <p className="text-lg font-bold tabular-nums">
                          {used}/{total}
                        </p>
                      </div>
                    </div>
                    <span
                      className="text-sm font-medium -mt-1"
                      style={{ color: t.color }}
                    >
                      {t.label}
                    </span>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}

      <BalanceReportTable year={year} />
    </div>
  )
}
