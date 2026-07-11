import { cn } from "@/lib/utils";
import type { Child } from "./data";

export function ChildSwitcher({
  children,
  selectedId,
  onSelect,
}: {
  children: Child[];
  selectedId: string | "all";
  onSelect: (id: string | "all") => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => onSelect("all")}
        className={cn(
          "rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors",
          selectedId === "all"
            ? "border-ink bg-ink text-white dark:border-white dark:bg-white dark:text-ink"
            : "border-line text-ink-500 dark:border-line-dark dark:text-ink-300"
        )}
      >
        All children
      </button>
      {children.map((child) => (
        <button
          key={child.id}
          onClick={() => onSelect(child.id)}
          className={cn(
            "flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors",
            selectedId === child.id
              ? "border-ink bg-ink text-white dark:border-white dark:bg-white dark:text-ink"
              : "border-line text-ink-500 dark:border-line-dark dark:text-ink-300"
          )}
        >
          <span className={cn("h-4 w-4 rounded-full", child.avatarColor)} />
          {child.name.split(" ")[0]}
        </button>
      ))}
    </div>
  );
}
