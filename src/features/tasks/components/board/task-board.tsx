"use client";

import { useMemo, useState } from "react";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  type DragStartEvent,
  type DragEndEvent,
} from "@dnd-kit/core";
import { useTaskFilters } from "../../hooks/use-task-filters";
import { useUpdateTaskStatus } from "../../hooks/use-tasks";
import { useColumnOrder } from "../../hooks/use-column-order";
import { BoardColumn } from "./board-column";
import { TaskCard } from "./task-card";
import { TaskStatus, TaskStatusOptions } from "../../types";
import type { Task } from "../../types";
import { BoardToolbar } from "./board-toolbar";
import { useDisclosure } from "@/hooks/use-disclosure";
import { TaskDetailModal } from "../task-detail-modal";
import { BoardSkeleton } from "./board-skeleton";

function applyStoredOrder(tasks: Task[], storedOrder: string[]): Task[] {
  if (storedOrder.length === 0) return tasks;
  const taskMap = new Map(tasks.map((t) => [t.id, t]));
  const ordered: Task[] = [];
  for (const id of storedOrder) {
    const task = taskMap.get(id);
    if (task) {
      ordered.push(task);
      taskMap.delete(id);
    }
  }
  ordered.push(...taskMap.values());
  return ordered;
}

export function TasksBoard() {
  const {
    data: tasks,
    search,
    projectId,
    handleProjectChange,
    handleSearchChange,
  } = useTaskFilters(200);

  const { mutate: updateTaskStatus } = useUpdateTaskStatus();
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
  );

  // scope: keeps ordering preferences separate per project filter
  const scope = projectId ?? "all";

  // one order-store per status column, all scoped to the current project filter
  const backlogOrder = useColumnOrder(scope, TaskStatus.BACKLOG);
  const todoOrder = useColumnOrder(scope, TaskStatus.TODO);
  const inProgressOrder = useColumnOrder(scope, TaskStatus.IN_PROGRESS);
  const pausedOrder = useColumnOrder(scope, TaskStatus.PAUSED);
  const inReviewOrder = useColumnOrder(scope, TaskStatus.IN_REVIEW);
  const doneOrder = useColumnOrder(scope, TaskStatus.DONE);
  const cancelledOrder = useColumnOrder(scope, TaskStatus.CANCELLED);
  const blockedOrder = useColumnOrder(scope, TaskStatus.BLOCKED);

  const orderStores: Record<TaskStatus, ReturnType<typeof useColumnOrder>> = {
    [TaskStatus.BACKLOG]: backlogOrder,
    [TaskStatus.TODO]: todoOrder,
    [TaskStatus.IN_PROGRESS]: inProgressOrder,
    [TaskStatus.PAUSED]: pausedOrder,
    [TaskStatus.IN_REVIEW]: inReviewOrder,
    [TaskStatus.DONE]: doneOrder,
    [TaskStatus.CANCELLED]: cancelledOrder,
    [TaskStatus.BLOCKED]: blockedOrder,
  };

  const columns = useMemo(() => {
    const grouped: Record<TaskStatus, Task[]> = {
      [TaskStatus.BACKLOG]: [],
      [TaskStatus.TODO]: [],
      [TaskStatus.IN_PROGRESS]: [],
      [TaskStatus.PAUSED]: [],
      [TaskStatus.IN_REVIEW]: [],
      [TaskStatus.DONE]: [],
      [TaskStatus.CANCELLED]: [],
      [TaskStatus.BLOCKED]: [],
    };
    for (const task of tasks) {
      grouped[task.status]?.push(task);
    }
    // apply each column's stored order on top of the raw grouping
    for (const status of Object.keys(grouped) as TaskStatus[]) {
      grouped[status] = applyStoredOrder(
        grouped[status],
        orderStores[status].order,
      );
    }
    return grouped;
  }, [tasks, orderStores]);

  function handleDragStart(event: DragStartEvent) {
    const task = tasks.find((t) => t.id === event.active.id);
    setActiveTask(task ?? null);
  }

  function handleDragEnd(event: DragEndEvent) {
    setActiveTask(null);
    const { active, over } = event;
    if (!over) return;

    const taskId = active.id as string;
    const overData = over.data.current as
      | { type?: string; status?: TaskStatus }
      | undefined;
    const overTask = tasks.find((t) => t.id === over.id);
    const newStatus =
      overData?.type === "column" ? overData.status : overTask?.status;
    if (!newStatus) return;

    const task = tasks.find((t) => t.id === taskId);
    if (!task) return;

    if (task.status !== newStatus) {
      updateTaskStatus({ id: taskId, status: newStatus });
      return;
    }

    // same-column reorder: local-only, no backend call
    if (overTask && overTask.id !== taskId) {
      const store = orderStores[newStatus];
      const currentIds = columns[newStatus].map((t) => t.id);
      const oldIndex = currentIds.indexOf(taskId);
      const newIndex = currentIds.indexOf(overTask.id);
      if (oldIndex === -1 || newIndex === -1) return;

      const newOrder = [...currentIds];
      newOrder.splice(oldIndex, 1);
      newOrder.splice(newIndex, 0, taskId);
      store.persistOrder(newOrder);
    }
  }

  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const { open, onOpen, onOpenChange } = useDisclosure();

  function handleTaskClick(task: Task) {
    setSelectedTask(task);
    onOpen();
  }

  return (
    <div className="flex flex-col gap-4 h-full min-h-0">
      <BoardToolbar
        search={search}
        onSearchChange={handleSearchChange}
        projectId={projectId}
        onProjectChange={handleProjectChange}
      />

      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="min-h-0 flex flex-1 gap-3 overflow-x-auto scrollbar-thin pb-4">
          {TaskStatusOptions.map((opt) => (
            <BoardColumn
              key={opt.value}
              status={opt.value}
              label={opt.label}
              tasks={columns[opt.value] ?? []}
              onTaskClick={handleTaskClick}
            />
          ))}
        </div>

        <DragOverlay dropAnimation={null}>
          {activeTask && <TaskCard task={activeTask} />}
        </DragOverlay>
      </DndContext>

      <TaskDetailModal
        task={selectedTask}
        open={open}
        onOpenChange={onOpenChange}
      />
    </div>
  );
}
