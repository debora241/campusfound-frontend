import { PageHeader } from "@/components/shared/PageHeader";
import { TIMETABLE } from "./data";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri"];
const SLOTS = ["8:00 – 9:00", "10:00 – 11:00", "11:00 – 12:00", "1:00 – 2:00"];

export function Timetable() {
  const lookup = (day: string, time: string) => TIMETABLE.find((t) => t.day === day && t.time === time);

  return (
    <div>
      <PageHeader title="Timetable" description="Your weekly teaching schedule" />
      <div className="overflow-x-auto rounded-lg border border-line dark:border-line-dark">
        <table className="w-full text-sm">
          <thead className="bg-ink-50 dark:bg-white/5">
            <tr>
              <th className="w-32 px-4 py-2.5 text-left text-xs font-medium text-ink-500 dark:text-ink-300">Time</th>
              {DAYS.map((d) => (
                <th key={d} className="px-4 py-2.5 text-left text-xs font-medium text-ink-500 dark:text-ink-300">{d}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {SLOTS.map((slot, i) => (
              <tr key={slot} className={i !== 0 ? "border-t border-line dark:border-line-dark" : ""}>
                <td className="px-4 py-3 text-xs text-ink-300">{slot}</td>
                {DAYS.map((d) => {
                  const entry = lookup(d, slot);
                  return (
                    <td key={d} className="px-4 py-3">
                      {entry ? (
                        <div className="rounded-md bg-ink-50 px-2.5 py-1.5 text-xs dark:bg-white/5">
                          <p className="font-medium">{entry.className}</p>
                          <p className="text-ink-300">{entry.room}</p>
                        </div>
                      ) : (
                        <span className="text-xs text-ink-300">—</span>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
