import { cn } from "@/lib/utils"

const TYPE_STYLES = {
  PAID: "bg-green-500/15 text-green-700 dark:text-green-400",
  SICK: "bg-orange-500/15 text-orange-700 dark:text-orange-400",
  PERSONAL: "bg-red-500/15 text-red-700 dark:text-red-400",
} as const

type DayOffType = keyof typeof TYPE_STYLES

export function DayOffTypeBadge({ type, className }: { type: DayOffType; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex ring-1 items-center rounded-full px-2 py-0.5 text-[10px] font-semibold",
        TYPE_STYLES[type],
        className
      )}
    >
      {type}
    </span>
  )
}
