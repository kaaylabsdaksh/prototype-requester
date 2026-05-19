import { cn } from "@/lib/utils";
import { DiscoverStatus, DISCOVER_STATUS_LABEL } from "@/data/requesterDiscover";

const MAP: Record<DiscoverStatus, string> = {
  available: "bg-[hsl(140_55%_92%)] text-[hsl(140_55%_30%)]",
  limited: "bg-[hsl(45_95%_92%)] text-[hsl(35_85%_40%)]",
  full_waitlist: "bg-[hsl(280_70%_94%)] text-[hsl(280_60%_45%)]",
  waitlisted: "bg-[hsl(220_85%_94%)] text-[hsl(220_85%_45%)]",
  closed: "bg-[hsl(220_10%_94%)] text-[hsl(220_10%_45%)]",
};

export function EventStatusChip({ s, className }: { s: DiscoverStatus; className?: string }) {
  return (
    <span className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold", MAP[s], className)}>
      {DISCOVER_STATUS_LABEL[s]}
    </span>
  );
}
