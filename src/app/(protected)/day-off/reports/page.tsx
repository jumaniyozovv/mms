"use client"

import Link from "next/link"
import { FileText, BarChart3, Scale, CalendarRange } from "lucide-react"
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

const reports = [
  {
    title: "Detailed",
    description: "Per-request breakdown with dates, types, and statuses",
    icon: FileText,
    href: "/day-off/reports/detailed",
  },
  {
    title: "Total",
    description: "Summary of used days grouped by type",
    icon: BarChart3,
    href: "/day-off/reports/total",
  },
  {
    title: "Balance",
    description: "Remaining days available per type",
    icon: Scale,
    href: "/day-off/reports/balance",
  },
  {
    title: "Monthly",
    description: "Month-by-month usage breakdown",
    icon: CalendarRange,
    href: "/day-off/reports/monthly",
  },
]

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">Reports</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {reports.map((report) => (
          <Link key={report.href} href={report.href}>
            <Card className="hover:bg-muted/50 transition-colors cursor-pointer h-full">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <report.icon className="h-5 w-5 text-muted-foreground" />
                  <CardTitle>{report.title}</CardTitle>
                </div>
                <CardDescription>{report.description}</CardDescription>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
