"use client";

import { useState, useTransition } from "react";
import { toggleTaskStatus } from "@/actions/workspace";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/utils/cn";

interface TaskItem {
  id: string;
  title: string;
  description: string | null;
  priority: "LOW" | "MEDIUM" | "HIGH";
  status: string;
}

const priorityTone = { HIGH: "warning", MEDIUM: "info", LOW: "neutral" } as const;

export function TaskList({ tasks }: { tasks: TaskItem[] }) {
  const [done, setDone] = useState<Record<string, boolean>>({});
  const [, startTransition] = useTransition();

  return (
    <ul className="flex flex-col gap-2">
      {tasks.map((task) => {
        const isDone = done[task.id] ?? task.status === "DONE";
        return (
          <li
            key={task.id}
            className="flex items-start gap-3 rounded-lg border border-neutral-200 p-3 dark:border-neutral-800"
          >
            <input
              type="checkbox"
              checked={isDone}
              onChange={(e) => {
                const next = e.target.checked;
                setDone((d) => ({ ...d, [task.id]: next }));
                startTransition(() => {
                  toggleTaskStatus(task.id, next);
                });
              }}
              className="mt-1 h-4 w-4 rounded border-neutral-300 dark:border-neutral-700"
            />
            <div className="flex-1">
              <p className={cn("text-sm font-medium text-neutral-900 dark:text-neutral-100", isDone && "line-through opacity-50")}>
                {task.title}
              </p>
              {task.description && (
                <p className="mt-0.5 text-xs text-neutral-500 dark:text-neutral-400">{task.description}</p>
              )}
            </div>
            <Badge tone={priorityTone[task.priority]}>{task.priority}</Badge>
          </li>
        );
      })}
      {tasks.length === 0 && (
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          No priorities queued yet — ask me anything in the chat to get started.
        </p>
      )}
    </ul>
  );
}
