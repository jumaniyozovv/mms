"use client"

import * as React from "react"
import FullCalendar from "@fullcalendar/react"
import dayGridPlugin from "@fullcalendar/daygrid"
import timeGridPlugin from "@fullcalendar/timegrid"
import interactionPlugin from "@fullcalendar/interaction"
import type { DateClickArg } from "@fullcalendar/interaction"
import type { EventInput, DatesSetArg, EventClickArg } from "@fullcalendar/core"
import { format, addDays } from "date-fns"

import { useDisclosure } from "@/hooks/use-disclosure"
import { useDayOffs } from "../hooks"
import { useHolidaysInRange } from "@/features/day-off/settings/holidays/hooks"
import type { HolidayItem } from "@/features/day-off/settings/holidays/types"
import type { DayOffListItem, DayOffCalendarFilters } from "../types"
import { CreateDayOffDialog } from "./create-day-off-dialog"
import { DayOffDetailDialog } from "./day-off-detail-dialog"

const TYPE_COLORS: Record<string, string> = {
  PAID: "#22c55e",
  SICK: "#f97316",
  PERSONAL: "#ef4444",
}

const HOLIDAY_COLOR = "#8b5cf6"

const STATUS_OPACITY: Record<string, number> = {
  PENDING: 0.6,
  APPROVED: 1,
  REJECTED: 0.4,
}

function toHolidayEvents(holidays: HolidayItem[]): EventInput[] {
  return holidays.map((h) => ({
    id: `holiday-${h.id}`,
    title: h.name,
    start: h.date,
    allDay: true,
    display: "background",
    backgroundColor: HOLIDAY_COLOR,
    borderColor: HOLIDAY_COLOR,
    extendedProps: { isHoliday: true },
  }))
}

function toCalendarEvents(dayOffs: DayOffListItem[]): EventInput[] {
  return dayOffs.map((d) => {
    const color = TYPE_COLORS[d.type]
    const opacity = STATUS_OPACITY[d.status]

    return {
      id: d.id,
      title: `${d.userName}`,
      start: format(new Date(d.startDate), "yyyy-MM-dd"),
      end: format(addDays(new Date(d.endDate), 1), "yyyy-MM-dd"),
      backgroundColor: color,
      borderColor: color,
      textColor: "#fff",
      extendedProps: { dayOff: d },
      display: "block",
      classNames: opacity < 1 ? [`fc-event-opacity-${Math.round(opacity * 100)}`] : [],
    }
  })
}

export function DayOffCalendar() {
  const [filters, setFilters] = React.useState<DayOffCalendarFilters | null>(null)
  const createDialog = useDisclosure()
  const detailDialog = useDisclosure()
  const [selectedDate, setSelectedDate] = React.useState<string>("")
  const [selectedDayOff, setSelectedDayOff] = React.useState<DayOffListItem | null>(null)

  const { data: dayOffs } = useDayOffs(filters)
  const { data: holidays } = useHolidaysInRange(
    filters?.startDate ?? null,
    filters?.endDate ?? null
  )

  const events = React.useMemo(
    () => [
      ...toCalendarEvents(dayOffs || []),
      ...toHolidayEvents(holidays || []),
    ],
    [dayOffs, holidays]
  )

  function handleDatesSet(arg: DatesSetArg) {
    setFilters({
      startDate: format(arg.start, "yyyy-MM-dd"),
      endDate: format(arg.end, "yyyy-MM-dd"),
    })
  }

  function handleDateClick(arg: DateClickArg) {
    setSelectedDate(arg.dateStr)
    createDialog.onOpen()
  }

  function handleEventClick(arg: EventClickArg) {
    if (arg.event.extendedProps.isHoliday) return
    const dayOff = arg.event.extendedProps.dayOff as DayOffListItem
    setSelectedDayOff(dayOff)
    detailDialog.onOpen()
  }

  return (
    <div className="day-off-calendar flex flex-col">
      <div>
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          events={events}
          datesSet={handleDatesSet}
          dateClick={handleDateClick}
          eventClick={handleEventClick}
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "dayGridMonth,timeGridWeek,timeGridDay",
          }}
          height="auto"
          dayMaxEvents={3}
        />
      </div>

      <div className="flex items-center gap-4 my-3 shrink-0 text-xs text-muted-foreground">
        {Object.entries(TYPE_COLORS).map(([type, color]) => (
          <div key={type} className="flex items-center gap-1.5">
            <span className="size-2.5 rounded-full" style={{ background: color }} />
            <span>{type.charAt(0) + type.slice(1).toLowerCase()}</span>
          </div>
        ))}
        <div className="flex items-center gap-1.5">
          <span className="size-2.5 rounded-full" style={{ background: HOLIDAY_COLOR }} />
          <span>Holiday</span>
        </div>
      </div>

      <CreateDayOffDialog
        open={createDialog.open}
        onOpenChange={createDialog.onOpenChange}
        defaultDate={selectedDate}
      />

      <DayOffDetailDialog
        open={detailDialog.open}
        onOpenChange={detailDialog.onOpenChange}
        dayOff={selectedDayOff}
      />
    </div>
  )
}
