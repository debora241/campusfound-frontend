import { useEffect, useState } from "react";
import { NavLink, Outlet, useNavigate, Navigate } from "react-router-dom";
import { ArrowLeft, LogOut } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { logout as logoutAction } from "@/store/authSlice";
import { authApi } from "@/lib/authApi";
import { tokenStorage } from "@/lib/tokenStorage";
import { restoreSession } from "@/lib/sessionRestore";

const TABS = [
  { label: "Security", path: "/account/security" },
  { label: "Devices", path: "/account/devices" },
  { label: "Sessions", path: "/account/sessions" },
];

export function AccountShell() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const refreshToken = useAppSelector((s) => s.auth.refreshToken);
  const accessToken = useAppSelector((s) => s.auth.accessToken);
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

  const handleLogout = async () => {
    try {
      if (refreshToken) await authApi.logout(refreshToken);
    } catch {
      // Even if the backend call fails (e.g. offline), still clear the local session.
    }
    tokenStorage.clear();
    dispatch(logoutAction());
    toast.success("Signed out");
    navigate("/welcome");
  };

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

  return (
    <div className="min-h-screen bg-paper dark:bg-paper-dark">
      <header className="flex h-16 items-center justify-between gap-3 border-b border-line px-6 dark:border-line-dark">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="text-ink-300 hover:text-ink dark:hover:text-white" aria-label="Back">
            <ArrowLeft className="h-4 w-4" />
          </button>
          <h1 className="text-sm font-semibold">Account &amp; Security</h1>
        </div>
        <Button variant="secondary" size="sm" onClick={handleLogout}>
          <LogOut className="h-3.5 w-3.5" /> Log out
        </Button>
      </header>

      <div className="mx-auto max-w-2xl px-6 py-8">
        <nav className="mb-6 flex gap-1 border-b border-line dark:border-line-dark" aria-label="Account settings">
          {TABS.map((tab) => (
            <NavLink
              key={tab.path}
              to={tab.path}
              className={({ isActive }) =>
                cn(
                  "-mb-px border-b-2 px-3 py-2.5 text-sm font-medium",
                  isActive ? "border-ink text-ink dark:border-white dark:text-white" : "border-transparent text-ink-300"
                )
              }
            >
              {tab.label}
            </NavLink>
          ))}
        </nav>
        <Outlet />
      </div>
    </div>
  );
}
