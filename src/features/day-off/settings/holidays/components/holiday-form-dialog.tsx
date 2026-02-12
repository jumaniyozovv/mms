"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCreateHoliday, useUpdateHoliday } from "../hooks";
import { holidaySchema, type HolidayFormData } from "../schema";
import type { HolidayItem } from "../types";

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function getDaysInMonth(month: number): number {
  if ([1, 3, 5, 7, 8, 10, 12].includes(month)) return 31;
  if ([4, 6, 9, 11].includes(month)) return 30;
  return 29;
}

interface HolidayFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  holiday?: HolidayItem | null;
}

export function HolidayFormDialog({
  open,
  onOpenChange,
  holiday,
}: HolidayFormDialogProps) {
  const isEdit = !!holiday;
  const createMutation = useCreateHoliday();
  const updateMutation = useUpdateHoliday();
  const isPending = createMutation.isPending || updateMutation.isPending;

  const form = useForm<HolidayFormData>({
    resolver: zodResolver(holidaySchema),
    defaultValues: {
      name: "",
      day: "",
      month: "",
    },
  });

  const selectedMonth = form.watch("month");
  const maxDays = selectedMonth ? getDaysInMonth(Number(selectedMonth)) : 31;

  React.useEffect(() => {
    if (open) {
      if (holiday) {
        const [dd, mm] = holiday.date.split("-");
        form.reset({
          name: holiday.name,
          day: String(Number(dd)),
          month: String(Number(mm)),
        });
      } else {
        form.reset({ name: "", day: "", month: "" });
      }
    }
  }, [open, holiday, form]);

  function onSubmit(data: HolidayFormData) {
    const dd = data.day.padStart(2, "0");
    const mm = data.month.padStart(2, "0");
    const payload = { name: data.name, date: `${dd}-${mm}` };

    if (isEdit && holiday) {
      updateMutation.mutate(
        { id: holiday.id, data: payload },
        {
          onSuccess: () => {
            toast.success("Holiday updated");
            onOpenChange(false);
          },
          onError: () => {
            toast.error("Failed to update holiday");
          },
        }
      );
    } else {
      createMutation.mutate(payload, {
        onSuccess: () => {
          toast.success("Holiday created");
          onOpenChange(false);
        },
        onError: () => {
          toast.error("Failed to create holiday");
        },
      });
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Holiday" : "Add Holiday"}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Update the holiday details."
              : "Add a new national holiday. Holidays repeat every year."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g. Independence Day"
                      disabled={isPending}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="day"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Day</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={1}
                        max={maxDays}
                        placeholder="DD"
                        disabled={isPending}
                        {...field}
                        onChange={(e) => field.onChange(e.target.value)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="month"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Month</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      disabled={isPending}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select month" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {MONTHS.map((name, i) => (
                          <SelectItem key={i} value={String(i + 1)}>
                            {name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter>
              <Button type="submit" disabled={isPending}>
                {isPending
                  ? "Saving..."
                  : isEdit
                    ? "Update Holiday"
                    : "Add Holiday"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
