"use client";

import { useDroppable } from "@dnd-kit/core";
import { cn } from "@/lib/utils";
import { TaskCard } from "./task-card";
import type { Task, TaskStatus } from "../../types";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CreateTaskDialog } from "../actions/create-task-dialog";
import { Plus } from "lucide-react";
import { useState } from "react";
import { InlineCreateTaskForm } from "../actions/inline-create-task";

interface BoardColumnProps {
  status: TaskStatus;
  label: string;
  tasks: Task[];
  onTaskClick?:(task:Task)=>void
}


export function BoardColumn({ status, label, tasks, onTaskClick }: BoardColumnProps) {
const { setNodeRef, isOver } = useDroppable({ id: status, data: { type: "column", status } });
  const [isAdding, setIsAdding] = useState(false);
  return (
    <div
      ref={setNodeRef}
      className={cn(
        "flex flex-col w-72 shrink-0 rounded-sm border bg-muted/30 p-1 group/column",
        isOver && "bg-muted/60 ring-2 ring-primary/20"
      )}
    >
      <div className="flex items-center justify-between px-2 py-1.5 shrink-0">
        <span className="text-sm font-medium">{label}</span>
        <span className="text-xs text-muted-foreground">{tasks.length}</span>
      </div>
      <SortableContext items={tasks.map(t=>t.id)} strategy={verticalListSortingStrategy}>
      <div className="flex flex-col gap-1 flex-1 overflow-y-auto scrollbar-thin min-h-0">
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} onTaskClick={onTaskClick}/>
        ))}
      </div>
       {isAdding ? (
            <InlineCreateTaskForm
              status={status}
              projectId={tasks[0].projectId}
              onDone={() => setIsAdding(false)}
            />
          ) : (
            <button
              onClick={() => setIsAdding(true)}
              className="opacity-0 group-hover/column:opacity-100 transition-opacity flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground rounded-md p-2 hover:bg-accent/50"
            >
              <Plus className="size-3.5" />
              Add task
            </button>
          )}
      </SortableContext>
                  {/* <CreateTaskDialog className="group-hover/column:opacity-100"/> */}

    </div>
  );
}