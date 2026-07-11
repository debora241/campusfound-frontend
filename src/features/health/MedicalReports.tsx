import { Download, FileText } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MEDICAL_REPORTS } from "./data";

export function MedicalReports() {
  return (
    <div>
      <PageHeader title="Medical reports" description="Generated summaries and incident logs" />
      <div className="space-y-3">
        {MEDICAL_REPORTS.map((r) => (
          <Card key={r.id}>
            <CardContent className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <FileText className="h-4 w-4 text-ink-300" />
                <div>
                  <p className="font-medium">{r.title}</p>
                  <p className="text-xs text-ink-300">{r.school} · Generated {r.generatedOn}</p>
                </div>
              </div>
              <Button variant="secondary" size="sm">
                <Download className="h-3.5 w-3.5" /> Download
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
