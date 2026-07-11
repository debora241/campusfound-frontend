import { Sparkles } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CAREER_PATHS } from "./data";

export function CareerGuidance() {
  return (
    <div>
      <PageHeader
        title="AI Career Guidance"
        description="Career paths matched to your academic strengths and interests"
      />
      <div className="space-y-4">
        {CAREER_PATHS.map((path) => (
          <Card key={path.id}>
            <CardContent>
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="rounded-md bg-gold-light p-2">
                    <Sparkles className="h-4 w-4 text-gold-dark" />
                  </div>
                  <p className="font-semibold">{path.title}</p>
                </div>
                <Badge variant={path.matchScore >= 85 ? "verified" : "gold"}>{path.matchScore}% match</Badge>
              </div>
              <p className="mt-3 text-sm text-ink-500 dark:text-ink-300">{path.description}</p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {path.skills.map((skill) => (
                  <Badge key={skill} variant="neutral">
                    {skill}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
