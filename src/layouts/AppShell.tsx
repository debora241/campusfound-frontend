import { useEffect, useState } from "react";
import { Outlet, Navigate } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { CommandPalette } from "./CommandPalette";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { restoreSession } from "@/lib/sessionRestore";
import { ROLE_DASHBOARD_PATH, type Role } from "@/config/navigation";

export function AppShell({ role }: { role: Role }) {
  const dispatch = useAppDispatch();
  const accessToken = useAppSelector((s) => s.auth.accessToken);
  const backendUser = useAppSelector((s) => s.auth.backendUser);
  const [checking, setChecking] = useState(!accessToken);

  useEffect(() => {
    if (accessToken) {
      setChecking(false);
      return;
    }
    let cancelled = false;
    restoreSession(dispatch).then(() => {
      if (!cancelled) setChecking(false);
    });
    return () => {
      cancelled = true;
    };
  }, [accessToken, dispatch]);

  if (checking) {
    return (
      <div className="flex h-screen items-center justify-center bg-paper text-sm text-ink-300 dark:bg-paper-dark">
        Loading…
      </div>
    );
  }

  if (!accessToken) {
    return <Navigate to="/onboarding" replace />;
  }

  if (backendUser && backendUser.dashboardRole !== role) {
    return <Navigate to={ROLE_DASHBOARD_PATH[backendUser.dashboardRole as Role]} replace />;
  }

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
