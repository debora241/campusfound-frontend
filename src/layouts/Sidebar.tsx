import { NavLink } from "react-router-dom";
import { GraduationCap } from "lucide-react";
import { NAVIGATION, ROLE_LABELS, type Role } from "@/config/navigation";
import { cn } from "@/lib/utils";

export function Sidebar({ role }: { role: Role }) {
  const items = NAVIGATION[role];

  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r border-line bg-white dark:bg-paper-dark dark:border-line-dark md:flex">
      <div className="flex h-16 items-center gap-2 border-b border-line px-5 dark:border-line-dark">
        <div className="seal !h-8 !w-8 !border-ink !text-ink dark:!border-white dark:!text-white">
          <GraduationCap className="h-4 w-4" />
        </div>
        <div className="leading-tight">
          <p className="text-sm font-semibold">CampusFound</p>
          <p className="text-[11px] text-ink-300">{ROLE_LABELS[role]}</p>
        </div>
      </div>

      <nav className="flex-1 space-y-0.5 overflow-y-auto p-3" aria-label="Primary">
        {items.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === `/${role === "school_admin" ? "school" : role}`}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                isActive
                  ? "bg-ink text-white dark:bg-white dark:text-ink"
                  : "text-ink-500 hover:bg-ink-50 dark:text-ink-300 dark:hover:bg-white/5"
              )
            }
          >
            <item.icon className="h-4 w-4 shrink-0" />
            <span className="truncate">{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
