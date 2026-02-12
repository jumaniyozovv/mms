"use client";

import * as React from "react";
import { Pencil, Trash2, Plus, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useDisclosure } from "@/hooks/use-disclosure";
import { useHolidays, useDeleteHoliday } from "../hooks";
import type { HolidayItem } from "../types";
import { HolidayFormDialog } from "./holiday-form-dialog";

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function formatDayMonth(date: string): string {
  const [dd, mm] = date.split("-").map(Number);
  return `${dd} ${MONTH_NAMES[mm - 1]}`;
}

export function HolidayList() {
  const { data: holidays, isLoading } = useHolidays();
  const deleteMutation = useDeleteHoliday();

  const formDialog = useDisclosure();
  const deleteDialog = useDisclosure();
  const [selectedHoliday, setSelectedHoliday] =
    React.useState<HolidayItem | null>(null);
  const [deleteTarget, setDeleteTarget] = React.useState<HolidayItem | null>(
    null
  );

  function handleEdit(holiday: HolidayItem) {
    setSelectedHoliday(holiday);
    formDialog.onOpen();
  }

  function handleAdd() {
    setSelectedHoliday(null);
    formDialog.onOpen();
  }

  function handleDeleteClick(holiday: HolidayItem) {
    setDeleteTarget(holiday);
    deleteDialog.onOpen();
  }

  function handleDeleteConfirm() {
    if (!deleteTarget) return;
    deleteMutation.mutate(deleteTarget.id, {
      onSuccess: () => {
        toast.success("Holiday deleted");
        deleteDialog.onClose();
      },
      onError: () => {
        toast.error("Failed to delete holiday");
      },
    });
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">National Holidays</h3>
        <Button onClick={handleAdd} size="sm">
          <Plus className="mr-2 h-4 w-4" />
          Add Holiday
        </Button>
      </div>

      {!holidays?.length ? (
        <div className="rounded-md border p-8 text-center text-muted-foreground">
          No holidays configured yet. Add your first holiday.
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {holidays.map((holiday) => (
                <TableRow key={holiday.id}>
                  <TableCell className="font-medium">{holiday.name}</TableCell>
                  <TableCell>{formatDayMonth(holiday.date)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(holiday)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteClick(holiday)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <HolidayFormDialog
        open={formDialog.open}
        onOpenChange={formDialog.onOpenChange}
        holiday={selectedHoliday}
      />

      <AlertDialog open={deleteDialog.open} onOpenChange={deleteDialog.onOpenChange}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Holiday</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &quot;{deleteTarget?.name}&quot;? This
              action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
