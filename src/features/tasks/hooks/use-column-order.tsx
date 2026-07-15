import { useState, useEffect, useCallback } from "react";
import type { TaskStatus } from "../types";

function storageKey(scope: string, status: TaskStatus) {
  return `kanban-order:${scope}:${status}`;
}

export function useColumnOrder(scope: string, status: TaskStatus) {
  const [order, setOrder] = useState<string[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(storageKey(scope, status));
    if (stored) {
      try {
        setOrder(JSON.parse(stored));
      } catch {
        setOrder([]);
      }
    } else {
      setOrder([]);
    }
  }, [scope, status]);

  const persistOrder = useCallback(
    (newOrder: string[]) => {
      setOrder(newOrder);
      localStorage.setItem(storageKey(scope, status), JSON.stringify(newOrder));
    },
    [scope, status]
  );

  return { order, persistOrder };
}