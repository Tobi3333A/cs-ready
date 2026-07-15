"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";

type Task = {
  id: string;
  task: string;
  is_done: boolean;
};

export function RoadmapTasks({ tasks }: { tasks: Task[] }) {
  const [completed, setCompleted] = useState<Set<string>>(
    () => new Set(tasks.filter((t) => t.is_done).map((t) => t.id))
  );

  async function toggle(id: string) {
    const supabase = createClient();
    const { error } = await supabase
      .from('roadmap_tasks')
      .update({
        is_done: !completed.has(id)
      })
      .eq('id', id)
    if (error) console.error('Error updating task checkmark');

    setCompleted((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  return (
    <ul className="mt-4 space-y-2">
      {tasks.map((task) => {
        const done = completed.has(task.id);
        return (
          <li key={task.id} className="flex items-center gap-2.5 text-sm">
            <button
              type="button"
              onClick={() => toggle(task.id)}
              aria-pressed={done}
              aria-label={done ? "Mark as incomplete" : "Mark as complete"}
              className={cn(
                "grid h-5 w-5 shrink-0 cursor-pointer place-items-center rounded-md text-[10px] transition-colors",
                done
                  ? "bg-accent-500/20 text-accent-400"
                  : "bg-white/5 text-subtle hover:bg-white/10"
              )}
            >
              {done ? "✓" : "○"}
            </button>
            <span className={cn(done ? "text-subtle line-through" : "text-muted")}>
              {task.task}
            </span>
          </li>
        );
      })}
    </ul>
  );
}
