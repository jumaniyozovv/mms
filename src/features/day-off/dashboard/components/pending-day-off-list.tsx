"use client"

import { format } from "date-fns"
import { Check, X, Trash2 } from "lucide-react"
import { toast } from "sonner"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DayOffTypeBadge } from "./badge"
import { useAuth } from "@/shared/providers/AuthProvider"
import { useMyPendingDayOffs, useDeleteDayOff, useUpdateDayOffStatus } from "../hooks"

export function PendingDayOffList() {
  const { user } = useAuth()
  const isAdmin = user?.role === "ADMIN"
  const { data: pending } = useMyPendingDayOffs()
  const deleteMutation = useDeleteDayOff()
  const statusMutation = useUpdateDayOffStatus()

  function handleDelete(id: string) {
    deleteMutation.mutate(id, {
      onSuccess: () => toast.success("Request deleted"),
      onError: () => toast.error("Failed to delete request"),
    })
  }

  function handleStatus(id: string, status: "APPROVED" | "REJECTED") {
    statusMutation.mutate(
      { id, data: { status } },
      {
        onSuccess: () => toast.success(`Request ${status.toLowerCase()}`),
        onError: () => toast.error("Failed to update request"),
      }
    )
  }

  const isBusy = deleteMutation.isPending || statusMutation.isPending

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">Pending Requests</CardTitle>
      </CardHeader>
      <CardContent>
        {!pending?.length ? (
          <p className="text-muted-foreground text-sm">No pending requests</p>
        ) : (
          <div className="space-y-3">
            {pending.map((item) => (
              <div key={item.id} className="flex items-start justify-between gap-2">
                <div className="min-w-0 space-y-0.5">
                  <div className="flex items-center gap-1.5">
                    <DayOffTypeBadge type={item.type} />
                    {isAdmin && (
                      <span className="text-xs font-medium truncate">{item.userName}</span>
                    )}
                  </div>
                  <p className="text-muted-foreground text-xs truncate">
                    {format(new Date(item.startDate), "MMM d")}
                    {" – "}
                    {format(new Date(item.endDate), "MMM d")}
                  </p>
                </div>
                <div className="flex items-center shrink-0">
                  {isAdmin && (
                    <>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-7 text-muted-foreground hover:text-green-600"
                        onClick={() => handleStatus(item.id, "APPROVED")}
                        disabled={isBusy}
                      >
                        <Check className="size-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-7 text-muted-foreground hover:text-orange-500"
                        onClick={() => handleStatus(item.id, "REJECTED")}
                        disabled={isBusy}
                      >
                        <X className="size-3.5" />
                      </Button>
                    </>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-7 text-muted-foreground hover:text-destructive"
                    onClick={() => handleDelete(item.id)}
                    disabled={isBusy}
                  >
                    <Trash2 className="size-3.5" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
