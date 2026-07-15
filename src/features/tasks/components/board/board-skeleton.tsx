import { Skeleton } from "@/components/ui/skeleton";

export function BoardSkeleton() {
  return (
    <div className="flex gap-3 overflow-x-auto pb-4 flex-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex flex-col w-72 shrink-0 rounded-sm border bg-muted/30 p-1 h-full">
          <div className="flex items-center justify-between px-2 py-1.5">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-6" />
          </div>
          <div className="flex flex-col gap-1.5 p-1">
            {Array.from({ length: 3 }).map((_, j) => (
              <Skeleton key={j} className="h-20 w-full rounded-md" />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}