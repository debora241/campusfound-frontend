import { Search, Bell, Wifi, WifiOff, Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export function Topbar() {
  const [dark, setDark] = useState(false);
  const [online, setOnline] = useState(navigator.onLine);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  useEffect(() => {
    const on = () => setOnline(true);
    const off = () => setOnline(false);
    window.addEventListener("online", on);
    window.addEventListener("offline", off);
    return () => {
      window.removeEventListener("online", on);
      window.removeEventListener("offline", off);
    };
  }, []);

  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-line bg-white px-5 dark:border-line-dark dark:bg-paper-dark">
      <button
        className="flex w-72 items-center gap-2 rounded-md border border-line px-3 py-2 text-sm text-ink-300 hover:border-ink-300 dark:border-line-dark"
        onClick={() => document.dispatchEvent(new KeyboardEvent("keydown", { key: "k", metaKey: true }))}
      >
        <Search className="h-4 w-4" />
        <span className="flex-1 text-left">Search…</span>
        <kbd className="rounded border border-line px-1.5 py-0.5 text-[10px] dark:border-line-dark">⌘K</kbd>
      </button>

      <div className="flex items-center gap-2">
        <span
          className="flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium"
          title={online ? "Synced" : "Offline — changes will sync when reconnected"}
        >
          {online ? (
            <Wifi className="h-3.5 w-3.5 text-verified" />
          ) : (
            <WifiOff className="h-3.5 w-3.5 text-alert" />
          )}
        </span>
        <Button variant="ghost" size="icon" aria-label="Notifications">
          <Bell className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" aria-label="Toggle theme" onClick={() => setDark((d) => !d)}>
          {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </Button>
        <Link to="/account/security" className="ml-1 block h-8 w-8 rounded-full bg-gold-light" aria-label="Account & security" />
      </div>
    </header>
  );
}
