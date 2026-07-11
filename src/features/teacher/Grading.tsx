import { useState } from "react";
import { toast } from "sonner";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { GRADEBOOK, type GradeEntry } from "./data";

type Column = "assignment1" | "assignment2" | "midterm";
const COLUMNS: { key: Column; label: string; max: number }[] = [
  { key: "assignment1", label: "Assignment 1 (/20)", max: 20 },
  { key: "assignment2", label: "Assignment 2 (/20)", max: 20 },
  { key: "midterm", label: "Midterm (/40)", max: 40 },
];

export function Grading() {
  const [rows, setRows] = useState<GradeEntry[]>(GRADEBOOK);

  const updateGrade = (studentId: string, key: Column, value: string) => {
    const num = value === "" ? null : Math.max(0, Number(value));
    setRows((prev) => prev.map((r) => (r.studentId === studentId ? { ...r, [key]: num } : r)));
  };

  const average = (row: GradeEntry) => {
    const scores = [row.assignment1, row.assignment2, row.midterm].filter((v): v is number => v !== null);
    const max = COLUMNS.reduce((s, c, i) => (scores[i] !== undefined ? s + c.max : s), 0);
    if (scores.length === 0) return "—";
    return `${Math.round((scores.reduce((s, v) => s + v, 0) / max) * 100)}%`;
  };

  return (
    <div>
      <PageHeader
        title="Grading"
        description="Form 5A — Mathematics"
        actions={<Button size="sm" onClick={() => toast.success("Gradebook saved")}>Save gradebook</Button>}
      />

      <div className="overflow-x-auto rounded-lg border border-line dark:border-line-dark">
        <table className="w-full text-sm">
          <thead className="bg-ink-50 dark:bg-white/5">
            <tr>
              <th className="px-4 py-2.5 text-left text-xs font-medium text-ink-500 dark:text-ink-300">Student</th>
              {COLUMNS.map((c) => (
                <th key={c.key} className="px-4 py-2.5 text-left text-xs font-medium text-ink-500 dark:text-ink-300">{c.label}</th>
              ))}
              <th className="px-4 py-2.5 text-left text-xs font-medium text-ink-500 dark:text-ink-300">Average</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={row.studentId} className={i !== 0 ? "border-t border-line dark:border-line-dark" : ""}>
                <td className="px-4 py-2.5 font-medium">{row.studentName}</td>
                {COLUMNS.map((c) => (
                  <td key={c.key} className="px-4 py-2.5">
                    <input
                      type="number"
                      min={0}
                      max={c.max}
                      value={row[c.key] ?? ""}
                      onChange={(e) => updateGrade(row.studentId, c.key, e.target.value)}
                      placeholder="—"
                      className="h-9 w-20 rounded-md border border-line bg-transparent px-2 text-sm outline-none focus:border-ink dark:border-line-dark dark:focus:border-white"
                    />
                  </td>
                ))}
                <td className="px-4 py-2.5 font-medium">{average(row)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
