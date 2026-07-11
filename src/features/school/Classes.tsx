import { Users, MapPin } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CLASSES } from "./data";

export function Classes() {
  return (
    <div>
      <PageHeader
        title="Classes & courses"
        description={`${CLASSES.length} active classes this term`}
        actions={<Button size="sm">New class</Button>}
      />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {CLASSES.map((c) => (
          <Card key={c.id}>
            <CardContent>
              <p className="font-semibold">{c.name}</p>
              <p className="mt-0.5 text-sm text-ink-300">{c.teacher}</p>
              <div className="mt-4 flex items-center justify-between text-xs text-ink-300">
                <span className="flex items-center gap-1.5">
                  <Users className="h-3.5 w-3.5" /> {c.students} students
                </span>
                <span className="flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5" /> {c.room}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
