import { PlaceholderBadge } from "@/components/ui/PlaceholderBadge";
import { sampleHours } from "@/lib/content";
import type { Practice } from "@/lib/practices";
import { cn } from "@/lib/utils";

/** Real hours when the practice has them; otherwise sample hours, clearly labeled. */
export function HoursTable({ practice, className }: { practice: Practice; className?: string }) {
  const hours = practice.hours ?? sampleHours;
  return (
    <div className={className}>
      {!practice.hours && <PlaceholderBadge className="mb-4">Sample hours</PlaceholderBadge>}
      <table className="w-full text-sm">
        <caption className="sr-only">{practice.hours ? "Opening hours" : "Sample opening hours"}</caption>
        <tbody>
          {hours.map((row) => (
            <tr key={row.days} className="border-b border-line last:border-0">
              <th scope="row" className="py-2.5 pr-4 text-left font-normal text-muted">
                {row.days}
              </th>
              <td className={cn("py-2.5 text-right font-medium whitespace-nowrap tabular-nums")}>{row.time}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
