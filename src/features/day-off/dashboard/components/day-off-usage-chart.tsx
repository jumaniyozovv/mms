"use client"

import { RadialBarChart, RadialBar, PolarAngleAxis } from "recharts"
import { Card } from "@/components/ui/card"
import { ChartContainer, type ChartConfig } from "@/components/ui/chart"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel"
import { useDayOffUsage } from "../hooks"

const types = [
  {
    key: "paid",
    label: "Paid Day Off",
    color: "hsl(142, 71%, 45%)",
    usedKey: "paidUsed" as const,
    totalKey: "paidDaysOff" as const,
  },
  {
    key: "sick",
    label: "Sick Days Off",
    color: "hsl(24, 95%, 53%)",
    usedKey: "sickUsed" as const,
    totalKey: "sickDaysOff" as const,
  },
  {
    key: "personal",
    label: "Personal Day Off",
    color: "hsl(0, 84%, 60%)",
    usedKey: "personalUsed" as const,
    totalKey: "personalDaysOff" as const,
  },
]

export function DayOffUsageChart() {
  const { data: usage } = useDayOffUsage()

  if (!usage) return null

  return (
    <Carousel opts={{ loop:true, align:'center',watchFocus:true}} className="w-68">
      <CarouselContent>
        {types.map((type) => {
          const used = usage[type.usedKey]
          const total = usage[type.totalKey]
          const percentage = total > 0 ? (used / total) * 100 : 0

          const chartConfig = {
            [type.key]: { label: type.label, color: type.color },
          } satisfies ChartConfig

          const data = [
            { name: type.key, value: percentage, fill: type.color },
          ]

          return (
            <CarouselItem key={type.key} className="basis-1/2">
              <Card className="w-34 h-38 flex flex-col items-center  justify-center p-2">
                  <div className="relative">
                    <ChartContainer
                      config={chartConfig}
                      className="size-24  aspect-square"
                    >
                      <RadialBarChart
                        innerRadius="73%"
                        outerRadius="100%"
                        data={data}
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
                    <div className="absolute inset-0 flex items-center justify-center ">
                      <span
                        className="text-sm font-bold text-muted-foreground tabular-nums"
                      >
                        {used}/{total}
                      </span>
                    </div>
                  </div>
                  <p
                    className="text-xs font-semibold leading-0"
                    style={{ color: type.color }}
                  >
                    {type.label}
                  </p>
              </Card>
            </CarouselItem>
          )
        })}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  )
}
