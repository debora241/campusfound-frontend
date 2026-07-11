import { useState } from "react";
import { Globe, LogOut } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface Session {
  id: string;
  app: string;
  ip: string;
  started: string;
  current: boolean;
}

const INITIAL_SESSIONS: Session[] = [
  { id: "1", app: "CampusFound Mobile", ip: "197.234.xx.xx", started: "Today, 8:12 AM", current: true },
  { id: "2", app: "CampusFound Web", ip: "154.72.xx.xx", started: "Jul 2, 6:40 PM", current: false },
];

export function SessionManagement() {
  const [sessions, setSessions] = useState(INITIAL_SESSIONS);

  const endSession = (id: string) => {
    setSessions((s) => s.filter((session) => session.id !== id));
    toast.success("Session ended");
  };

  const endAllOthers = () => {
    setSessions((s) => s.filter((session) => session.current));
    toast.success("Signed out of all other sessions");
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-ink-300">{sessions.length} active session{sessions.length !== 1 && "s"}</p>
        {sessions.length > 1 && (
          <Button variant="destructive" size="sm" onClick={endAllOthers}>
            <LogOut className="h-3.5 w-3.5" /> Sign out others
          </Button>
        )}
      </div>

      {sessions.map((session) => (
        <Card key={session.id}>
          <CardContent className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Globe className="h-4 w-4 text-ink-300" />
              <div>
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium">{session.app}</p>
                  {session.current && <Badge variant="verified">Current</Badge>}
                </div>
                <p className="text-xs text-ink-300">
                  {session.ip} · Started {session.started}
                </p>
              </div>
            </div>
            {!session.current && (
              <Button variant="ghost" size="sm" onClick={() => endSession(session.id)}>
                End
              </Button>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
