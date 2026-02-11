"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useCreateDayOff, useDayOffUsage } from "../hooks"
import { createDayOffSchema, type CreateDayOffFormData } from "../schema"

interface CreateDayOffDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  defaultDate?: string
}

export function CreateDayOffDialog({
  open,
  onOpenChange,
  defaultDate,
}: CreateDayOffDialogProps) {
  const createMutation = useCreateDayOff()
  const { data: usage } = useDayOffUsage()

  const form = useForm<CreateDayOffFormData>({
    resolver: zodResolver(createDayOffSchema),
    defaultValues: {
      type: "PAID",
      startDate: defaultDate || "",
      endDate: defaultDate || "",
      reason: "",
    },
  })

  React.useEffect(() => {
    if (open && defaultDate) {
      form.reset({
        type: "PAID",
        startDate: defaultDate,
        endDate: defaultDate,
        reason: "",
      })
    }
  }, [open, defaultDate, form])

  function onSubmit(data: CreateDayOffFormData) {
    createMutation.mutate(data, {
      onSuccess: () => {
        toast.success("Day off request created")
        form.reset()
        onOpenChange(false)
      },
      onError: (error) => {
        toast.error(error.message || "Failed to create day off request")
      },
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Request Day Off</DialogTitle>
          <DialogDescription>
            Submit a new day off request for approval.
          </DialogDescription>
        </DialogHeader>

        {usage && (
          <div className="grid grid-cols-3 gap-2 text-sm">
            <div className="rounded-md border p-2 text-center">
              <div className="font-medium">Paid</div>
              <div className="text-muted-foreground">
                {usage.paidDaysOff - usage.paidUsed} remaining
              </div>
            </div>
            <div className="rounded-md border p-2 text-center">
              <div className="font-medium">Sick</div>
              <div className="text-muted-foreground">
                {usage.sickDaysOff - usage.sickUsed} remaining
              </div>
            </div>
            <div className="rounded-md border p-2 text-center">
              <div className="font-medium">Personal</div>
              <div className="text-muted-foreground">
                {usage.personalDaysOff - usage.personalUsed} remaining
              </div>
            </div>
          </div>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={createMutation.isPending}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="PAID">Paid</SelectItem>
                      <SelectItem value="SICK">Sick</SelectItem>
                      <SelectItem value="PERSONAL">Personal</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start Date</FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        disabled={createMutation.isPending}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>End Date</FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        disabled={createMutation.isPending}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="reason"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Reason (optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Reason for day off..."
                      disabled={createMutation.isPending}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="submit" disabled={createMutation.isPending}>
                {createMutation.isPending ? "Submitting..." : "Submit Request"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
