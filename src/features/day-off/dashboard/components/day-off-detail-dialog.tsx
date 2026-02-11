"use client"

import { format } from "date-fns"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog"
import { useAuth } from "@/shared/providers/AuthProvider"
import { useUpdateDayOffStatus, useDeleteDayOff } from "../hooks"
import type { DayOffListItem } from "../types"
import { DayOffStatusBadge } from "./badge"

interface DayOffDetailDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  dayOff: DayOffListItem | null
}

const statusVariant: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  PENDING: "secondary",
  APPROVED: "default",
  REJECTED: "destructive",
}

const typeLabel: Record<string, string> = {
  PAID: "Paid",
  SICK: "Sick",
  PERSONAL: "Personal",
}

export function DayOffDetailDialog({
  open,
  onOpenChange,
  dayOff,
}: DayOffDetailDialogProps) {
  const { user } = useAuth()
  const {mutate:updateStatusMutation,isPending:updatePending} = useUpdateDayOffStatus()
  const {mutate:deleteMutation,isPending:deletePending} = useDeleteDayOff()

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

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Employee</span>
            <span className="text-sm">{dayOff.userName}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Type</span>
            <span className="text-sm">{typeLabel[dayOff.type]}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Status</span>
            <DayOffStatusBadge status={dayOff.status}/>
              
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Start Date</span>
            <span className="text-sm">
              {format(new Date(dayOff.startDate), "MMM d, yyyy")}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">End Date</span>
            <span className="text-sm">
              {format(new Date(dayOff.endDate), "MMM d, yyyy")}
            </span>
          </div>
          {dayOff.reason && (
            <div>
              <span className="text-sm font-medium">Reason</span>
              <p className="mt-1 text-sm text-muted-foreground">
                {dayOff.reason}
              </p>
            </div>
          )}
        </div>

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
