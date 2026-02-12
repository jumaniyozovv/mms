"use client";

import { DayOffConfigCard } from "@/features/day-off/settings/components";

export default function UpdateLimitPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold tracking-tight">Day Off Limit Configuration</h1>
      <DayOffConfigCard />
    </div>
  );
}
