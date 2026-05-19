import { Entitlement } from "@/data/requester";
import { cn } from "@/lib/utils";

const TONES = {
  primary: "bg-primary",
  info: "bg-info",
  success: "bg-success",
  warning: "bg-warning",
} as const;

export function EntitlementWidget({ data }: { data: Entitlement }) {
  const remaining = data.total - data.used;
  const pct = data.total ? Math.round((data.used / data.total) * 100) : 0;
  const radius = 42;
  const circ = 2 * Math.PI * radius;
  const offset = circ - (pct / 100) * circ;

  return (
    <div className="rounded-3xl border border-border/60 bg-card/90 p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Entitlement usage</p>
          <p className="mt-1 text-base font-semibold">This year</p>
        </div>
        <span className="rounded-full bg-accent px-2.5 py-0.5 text-[11px] font-semibold text-accent-foreground">
          {remaining} left
        </span>
      </div>

      <div className="mt-4 flex items-center gap-5">
        <div className="relative h-28 w-28 shrink-0">
          <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
            <circle cx="50" cy="50" r={radius} stroke="hsl(var(--muted))" strokeWidth="10" fill="none" />
            <circle
              cx="50"
              cy="50"
              r={radius}
              stroke="hsl(var(--primary))"
              strokeWidth="10"
              fill="none"
              strokeDasharray={circ}
              strokeDashoffset={offset}
              strokeLinecap="round"
              className="transition-all duration-700"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-bold tabular-nums">{pct}%</span>
            <span className="text-[10px] text-muted-foreground">{data.used}/{data.total} used</span>
          </div>
        </div>
        <div className="min-w-0 flex-1 space-y-2.5">
          {data.byCategory.map((c) => {
            const p = Math.round((c.used / c.total) * 100);
            return (
              <div key={c.label}>
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-foreground/80">{c.label}</span>
                  <span className="tabular-nums text-muted-foreground">{c.used}/{c.total}</span>
                </div>
                <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                  <div className={cn("h-full rounded-full transition-all", TONES[c.tone])} style={{ width: `${p}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
