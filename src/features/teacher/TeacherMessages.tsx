import { useState } from "react";
import { useForm } from "react-hook-form";
import { Send } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { TEACHER_MESSAGES } from "./data";

export function TeacherMessages() {
  const [activeId, setActiveId] = useState(TEACHER_MESSAGES[0].id);
  const active = TEACHER_MESSAGES.find((m) => m.id === activeId)!;
  const { register, handleSubmit, reset } = useForm<{ reply: string }>();

  return (
    <div>
      <PageHeader title="Messages" description="Conversations with parents and school administration" />
      <div className="grid grid-cols-1 overflow-hidden rounded-lg border border-line dark:border-line-dark lg:grid-cols-[280px_1fr]">
        <div className="divide-y divide-line border-b border-line dark:divide-line-dark dark:border-line-dark lg:border-b-0 lg:border-r">
          {TEACHER_MESSAGES.map((m) => (
            <button
              key={m.id}
              onClick={() => setActiveId(m.id)}
              className={cn(
                "block w-full px-4 py-3 text-left text-sm transition-colors",
                m.id === activeId ? "bg-ink-50 dark:bg-white/5" : "hover:bg-ink-50/50 dark:hover:bg-white/5"
              )}
            >
              <div className="flex items-center justify-between">
                <p className="font-medium">{m.from}</p>
                {m.unread && <Badge variant="gold">new</Badge>}
              </div>
              <p className="mt-0.5 truncate text-xs text-ink-300">{m.preview}</p>
              <p className="mt-1 text-[11px] text-ink-300">{m.time}</p>
            </button>
          ))}
        </div>

        <div className="flex flex-col p-5">
          <div className="border-b border-line pb-3 dark:border-line-dark">
            <p className="font-medium">{active.from}</p>
            <p className="text-xs text-ink-300">{active.role}</p>
          </div>
          <div className="flex-1 py-4 text-sm text-ink-500 dark:text-ink-300">{active.preview}</div>
          <form className="flex gap-2 border-t border-line pt-3 dark:border-line-dark" onSubmit={handleSubmit(() => reset())}>
            <input
              {...register("reply")}
              placeholder="Type a reply…"
              className="h-10 flex-1 rounded-md border border-line bg-transparent px-3 text-sm outline-none focus:border-ink dark:border-line-dark dark:focus:border-white"
            />
            <Button type="submit" size="icon" aria-label="Send">
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
