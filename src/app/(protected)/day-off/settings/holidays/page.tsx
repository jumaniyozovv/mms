"use client";

import { HolidayList } from "@/features/day-off/settings/holidays/components";

export default function HolidaysSettingsPage() {
  return (
    <div className="space-y-6">
      <HolidayList />
    </div>
  );
}
