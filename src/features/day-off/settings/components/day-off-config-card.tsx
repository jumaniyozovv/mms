"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useDayOffConfig, useUpdateDayOffConfig } from "../hooks";
import { dayOffConfigSchema, type DayOffConfigFormValues } from "../schema";

export function DayOffConfigCard() {
  const { data: config, isLoading } = useDayOffConfig();
  const updateMutation = useUpdateDayOffConfig();

  const form = useForm<DayOffConfigFormValues>({
    resolver: zodResolver(dayOffConfigSchema),
    defaultValues: {
      paidDaysOff: 15,
      sickDaysOff: 5,
      personalDaysOff: 10,
    },
  });

  useEffect(() => {
    if (config) {
      form.reset(config);
    }
  }, [config, form]);

  const onSubmit = (data: DayOffConfigFormValues) => {
    updateMutation.mutate(data, {
      onSuccess: () => {
        toast.success("Day off limits updated successfully");
      },
      onError: () => {
        toast.error("Failed to update day off limits");
      },
    });
  };

  if (isLoading) {
    return (
      <Card className="max-w-lg">
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-lg">
      <CardHeader>
        <CardTitle>Day Off Limits</CardTitle>
        <CardDescription>
          Configure default day-off limits for new users. Changes apply to newly
          created users only.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="paidDaysOff"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Paid Days Off</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={0}
                      max={365}
                      {...field}
                      onChange={(e) => field.onChange(e.target.valueAsNumber)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="sickDaysOff"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sick Days Off</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={0}
                      max={365}
                      {...field}
                      onChange={(e) => field.onChange(e.target.valueAsNumber)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="personalDaysOff"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Personal Days Off</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={0}
                      max={365}
                      {...field}
                      onChange={(e) => field.onChange(e.target.valueAsNumber)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              disabled={updateMutation.isPending}
            >
              {updateMutation.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Save Changes
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
