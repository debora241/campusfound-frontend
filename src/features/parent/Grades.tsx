import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, ReferenceLine } from "recharts";
import { Sparkles } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CHILDREN } from "./data";

export function Grades() {
  return (
    <div className="space-y-6">
      <PageHeader title="Grades & AI performance prediction" description="GPA trend with next-term forecast based on current trajectory." />

      {CHILDREN.map((child) => {
        const forecast = child.gpaTrend[child.gpaTrend.length - 1];
        const declining = forecast.gpa < child.gpaTrend[child.gpaTrend.length - 2].gpa;

        return (
          <Card key={child.id}>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className={`h-8 w-8 rounded-full ${child.avatarColor}`} />
                <CardTitle className="text-sm font-semibold text-ink dark:text-white">{child.name}</CardTitle>
              </div>
              <Badge variant={declining ? "alert" : "verified"}>
                <Sparkles className="h-3 w-3" /> {declining ? "Needs attention" : "On track"}
              </Badge>
            </CardHeader>
            <CardContent>
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={child.gpaTrend}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E2E1DC" vertical={false} />
                    <XAxis dataKey="term" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                    <YAxis domain={[0, 4]} tick={{ fontSize: 12 }} axisLine={false} tickLine={false} width={30} />
                    <Tooltip />
                    <ReferenceLine x="T3" stroke="#E2E1DC" strokeDasharray="4 4" label={{ value: "Forecast →", fontSize: 11, fill: "#8492B8", position: "insideTopRight" }} />
                    <Line
                      type="monotone"
                      dataKey="gpa"
                      stroke={declining ? "#B3432B" : "#1F7A5C"}
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      strokeDasharray={undefined}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <p className="mt-3 text-xs text-ink-300">
                {declining
                  ? `AI model projects a GPA of ${forecast.gpa.toFixed(1)} next term if current attendance and assignment patterns continue. Early intervention (tutoring, parent-teacher check-in) is recommended.`
                  : `AI model projects continued improvement to ${forecast.gpa.toFixed(1)} next term based on consistent performance.`}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
