"use client";

import Link from "next/link";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Settings } from "lucide-react";
import { DayOffConfigCard } from "@/features/day-off/settings/components";


export default function DayOffSettingsPage() {
  return (
 <div className="space-y-6">
      {/* Clickable Navigation Card */}
      <Link href="/day-off/settings/update-limit">
        <Card className="cursor-pointer transition-all hover:shadow-md hover:border-primary">
          <CardHeader className="flex flex-row items-start gap-4 space-y-0">
            <div className="p-2 rounded-xl bg-primary/10">
              <Settings className="h-6 w-6 text-primary" />
            </div>

            <div>
              <CardTitle>Day Off Limit Configuration</CardTitle>
              <CardDescription>
                Configure maximum allowed day offs per employee and rules.
              </CardDescription>
            </div>
          </CardHeader>
        </Card>
      </Link>
    </div>
  );
}
