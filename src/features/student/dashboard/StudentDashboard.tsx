import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge, VerificationSeal } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCw, BookOpen, TrendingUp, Sparkles } from "lucide-react";

interface DashboardData {
  gpa: number;
  attendanceRate: number;
  upcoming: { id: string; title: string; due: string }[];
  credentials: { id: string; title: string; verified: boolean }[];
}

// Simulated fetch — swap for React Query + real API call.
function useDashboardData() {
  const [state, setState] = useState<
    { status: "loading" } | { status: "error" } | { status: "success"; data: DashboardData }
  >({ status: "loading" });

  useEffect(() => {
    const t = setTimeout(() => {
      setState({
        status: "success",
        data: {
          gpa: 3.6,
          attendanceRate: 94,
          upcoming: [
            { id: "1", title: "Mathematics — Problem Set 6", due: "Tomorrow, 11:59 PM" },
            { id: "2", title: "Physics Lab Report", due: "Fri, Jul 10" },
          ],
          credentials: [
            { id: "1", title: "Term 2 Report Card", verified: true },
            { id: "2", title: "Coding Club Badge", verified: true },
          ],
        },
      });
    }, 700);
    return () => clearTimeout(t);
  }, []);

  return state;
}

export function StudentDashboard() {
  const state = useDashboardData();

  if (state.status === "loading") return <DashboardSkeleton />;
  if (state.status === "error") return <DashboardError />;

  const { data } = state;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Welcome back, Aminata</h1>
          <p className="text-sm text-ink-300">Here's what's happening in your studies today.</p>
        </div>
        <Badge variant="gold">
          <Sparkles className="h-3 w-3" /> AI insights ready
        </Badge>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Current GPA</CardTitle>
            <TrendingUp className="h-4 w-4 text-verified" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold">{data.gpa.toFixed(1)}</p>
            <p className="mt-1 text-xs text-ink-300">+0.2 from last term</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Attendance</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold">{data.attendanceRate}%</p>
            <p className="mt-1 text-xs text-ink-300">This term</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>AI Career Match</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-semibold">Software Engineering</p>
            <p className="mt-1 text-xs text-ink-300">Based on your grades &amp; interests</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Upcoming assignments</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {data.upcoming.length === 0 ? (
              <EmptyRow icon={BookOpen} text="Nothing due — enjoy the break." />
            ) : (
              data.upcoming.map((item) => (
                <div key={item.id} className="flex items-center justify-between rounded-md border border-line px-3 py-2.5 text-sm dark:border-line-dark">
                  <span>{item.title}</span>
                  <span className="text-xs text-ink-300">{item.due}</span>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Verified credentials</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {data.credentials.map((c) => (
              <div key={c.id} className="flex items-center justify-between rounded-md border border-line px-3 py-2.5 text-sm dark:border-line-dark">
                <span>{c.title}</span>
                {c.verified && <VerificationSeal size="sm" />}
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6" aria-busy="true" aria-label="Loading dashboard">
      <div className="h-6 w-56 animate-pulse rounded bg-ink-50 dark:bg-white/5" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[0, 1, 2].map((i) => (
          <div key={i} className="h-28 animate-pulse rounded-lg bg-ink-50 dark:bg-white/5" />
        ))}
      </div>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="h-40 animate-pulse rounded-lg bg-ink-50 dark:bg-white/5" />
        <div className="h-40 animate-pulse rounded-lg bg-ink-50 dark:bg-white/5" />
      </div>
    </div>
  );
}

function DashboardError() {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-line py-20 text-center dark:border-line-dark">
      <AlertTriangle className="mb-3 h-8 w-8 text-alert" />
      <p className="font-medium">Couldn't load your dashboard</p>
      <p className="mt-1 max-w-sm text-sm text-ink-300">
        Check your connection and try again. Your work saved offline will sync automatically.
      </p>
      <Button className="mt-4" size="sm" onClick={() => window.location.reload()}>
        <RefreshCw className="h-3.5 w-3.5" /> Retry
      </Button>
    </div>
  );
}

function EmptyRow({ icon: Icon, text }: { icon: typeof BookOpen; text: string }) {
  return (
    <div className="flex flex-col items-center gap-2 py-8 text-center text-sm text-ink-300">
      <Icon className="h-6 w-6" />
      {text}
    </div>
  );
}
