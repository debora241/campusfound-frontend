import { useEffect, useState } from "react";
import { Command } from "cmdk";
import { useNavigate } from "react-router-dom";
import { NAVIGATION, type Role } from "@/config/navigation";

export function CommandPalette({ role }: { role: Role }) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((o) => !o);
      }
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-ink/40 pt-32"
      onClick={() => setOpen(false)}
    >
      <Command
        className="w-full max-w-lg overflow-hidden rounded-lg border border-line bg-white shadow-xl dark:border-line-dark dark:bg-[rgb(var(--surface))]"
        onClick={(e) => e.stopPropagation()}
        label="Command palette"
      >
        <Command.Input
          autoFocus
          placeholder="Search pages, students, actions…"
          className="w-full border-b border-line bg-transparent px-4 py-3 text-sm outline-none dark:border-line-dark"
        />
        <Command.List className="max-h-80 overflow-y-auto p-2">
          <Command.Empty className="px-3 py-6 text-center text-sm text-ink-300">
            No results found.
          </Command.Empty>
          {NAVIGATION[role].map((item) => (
            <Command.Item
              key={item.path}
              onSelect={() => {
                navigate(item.path);
                setOpen(false);
              }}
              className="flex cursor-pointer items-center gap-2 rounded-md px-3 py-2 text-sm aria-selected:bg-ink-50 dark:aria-selected:bg-white/5"
            >
              <item.icon className="h-4 w-4 text-ink-300" />
              {item.label}
            </Command.Item>
          ))}
        </Command.List>
      </Command>
    </div>
  );
}
