import { cn } from "@/lib/utils"

const STATUS_STYLES = {
  PENDING: "bg-amber-500/15 text-amber-700 dark:text-amber-400",
  APPROVED: "bg-green-500/15 text-green-700 dark:text-green-400",
  REJECTED: "bg-red-500/15 text-red-700 dark:text-red-400",
} as const

type DayOffStatus = keyof typeof STATUS_STYLES

export function DayOffStatusBadge({ status, className }: { status: DayOffStatus; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex ring-1 items-center rounded-full px-2 py-0.5 text-[10px] font-semibold",
        STATUS_STYLES[status],
        className
      )}
    >
      {status}
    </span>
  )
}
