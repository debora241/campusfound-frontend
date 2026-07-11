import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { CommandPalette } from "./CommandPalette";
import type { Role } from "@/config/navigation";

export function AppShell({ role }: { role: Role }) {
  return (
    <div className="flex h-screen bg-paper dark:bg-paper-dark">
      <Sidebar role={role} />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Topbar />
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
      <CommandPalette role={role} />
    </div>
  );
}
