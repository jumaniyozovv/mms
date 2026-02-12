"use client"

import { format } from "date-fns"
import { CalendarDays, UserCheck } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useAuth } from "@/shared/providers/AuthProvider"
import { useUpdateDayOffStatus, useDeleteDayOff } from "../hooks"
import type { DayOffListItem } from "../types"
import { DayOffStatusBadge, DayOffTypeBadge } from "./badge"

interface DayOffDetailDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  dayOff: DayOffListItem | null
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
}

export function DayOffDetailDialog({
  open,
  onOpenChange,
  dayOff,
}: DayOffDetailDialogProps) {
  const { user } = useAuth()
  const { mutate: updateStatusMutation, isPending: updatePending } =
    useUpdateDayOffStatus()
  const { mutate: deleteMutation, isPending: deletePending } =
    useDeleteDayOff()

  if (!dayOff) return null

  const isAdmin = user?.role === "ADMIN"
  const isOwner = user?.id === dayOff.userId
  const isStatusPending = dayOff.status === "PENDING"

  function handleApprove() {
    updateStatusMutation(
      { id: dayOff!.id, data: { status: "APPROVED" } },
      {
        onSuccess: () => {
          toast.success("Day off approved")
          onOpenChange(false)
        },
        onError: (error) => {
          toast.error(error.message || "Failed to approve")
        },
      }
    )
  }

  function handleReject() {
    updateStatusMutation(
      { id: dayOff!.id, data: { status: "REJECTED" } },
      {
        onSuccess: () => {
          toast.success("Day off rejected")
          onOpenChange(false)
        },
        onError: (error) => {
          toast.error(error.message || "Failed to reject")
        },
      }
    )
  }

  function handleDelete() {
    deleteMutation(dayOff!.id, {
      onSuccess: () => {
        toast.success("Day off request deleted")
        onOpenChange(false)
      },
      onError: (error) => {
        toast.error(error.message || "Failed to delete")
      },
    })
  }

  const isPendingAction = updatePending || deletePending

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Day Off Details</DialogTitle>
          <DialogDescription>
            View day off request information.
          </DialogDescription>
        </DialogHeader>

        {/* Employee & Status */}
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarFallback>{getInitials(dayOff.userName)}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{dayOff.userName}</p>
            <p className="text-xs text-muted-foreground">
              Submitted {format(new Date(dayOff.createdAt), "MMM d, yyyy")}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <DayOffTypeBadge type={dayOff.type} />
            <DayOffStatusBadge status={dayOff.status} />
          </div>
        </div>

        <Separator />

        {/* Dates */}
        <div className="flex items-start gap-3">
          <CalendarDays className="size-4 mt-0.5 text-muted-foreground shrink-0" />
          <div className="text-sm">
            <span>{format(new Date(dayOff.startDate), "MMM d, yyyy")}</span>
            <span className="text-muted-foreground mx-1.5">&mdash;</span>
            <span>{format(new Date(dayOff.endDate), "MMM d, yyyy")}</span>
          </div>
        </div>

        {/* Reason */}
        {dayOff.reason && (
          <div className="rounded-md bg-muted/50 px-3 py-2">
            <p className="text-xs font-medium text-muted-foreground mb-1">
              Reason
            </p>
            <p className="text-sm">{dayOff.reason}</p>
          </div>
        )}

        {/* Approval Info */}
        {dayOff.approverName && dayOff.approvedAt && (
          <>
            <Separator />
            <div className="flex items-center gap-3">
              <UserCheck className="size-4 text-muted-foreground shrink-0" />
              <div className="text-sm">
                <span className="text-muted-foreground">
                  {dayOff.status === "APPROVED" ? "Approved" : "Rejected"} by
                </span>{" "}
                <span className="font-medium">{dayOff.approverName}</span>
                <span className="text-muted-foreground">
                  {" "}
                  on {format(new Date(dayOff.approvedAt), "MMM d, yyyy 'at' HH:mm")}
                </span>
              </div>
            </div>
          </>
        )}

        <DialogFooter className="gap-2">
          {isAdmin && isStatusPending && (
            <>
              <Button
                variant="destructive"
                onClick={handleReject}
                disabled={isPendingAction}
              >
                Reject
              </Button>
              <Button onClick={handleApprove} disabled={isPendingAction}>
                Approve
              </Button>
            </>
          )}
          {isOwner && isStatusPending && (
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isPendingAction}
            >
              Delete Request
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
