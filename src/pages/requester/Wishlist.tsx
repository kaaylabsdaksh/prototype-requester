import { format } from "date-fns";
import { Heart, Clock3, MapPin, CalendarCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RequesterShell } from "@/components/requester/RequesterShell";
import { requesterWishlist, requesterWaitlist } from "@/data/requester";
import { cn } from "@/lib/utils";

export default function RequesterWishlist() {
  return (
    <RequesterShell>
      <div>
        <h1 className="font-display text-3xl font-semibold tracking-tight">Wishlist & Waitlist</h1>
        <p className="mt-1 text-sm text-muted-foreground">Saved events and queued waitlist requests.</p>
      </div>

      <section className="rounded-3xl border border-border/60 bg-card/90 p-5 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold">Wishlist</h2>
          <Badge variant="outline">{requesterWishlist.length} saved</Badge>
        </div>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
          {requesterWishlist.map((w) => (
            <div key={w.id} className="rounded-2xl border border-border/60 bg-card p-4 transition-all hover:shadow-soft">
              <div className="flex items-start justify-between gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent text-accent-foreground">
                  <Heart className="h-4 w-4" />
                </div>
                <Badge variant="outline" className="text-[10px]">{w.category}</Badge>
              </div>
              <p className="mt-3 truncate text-sm font-semibold">{w.event}</p>
              <div className="mt-1 space-y-0.5 text-[11px] text-muted-foreground">
                <div className="inline-flex items-center gap-1"><MapPin className="h-3 w-3" /> {w.venue}</div>
                <div className="inline-flex items-center gap-1"><CalendarCheck className="h-3 w-3" /> {format(new Date(w.date), "EEE, d MMM")}</div>
              </div>
              <div className="mt-3 flex gap-1.5">
                <Button size="sm" className="flex-1 rounded-full text-xs">Submit enquiry</Button>
                <Button size="sm" variant="outline" className="rounded-full text-xs">Remove</Button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-3xl border border-border/60 bg-card/90 p-5 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold">Waitlist</h2>
          <Badge variant="outline">{requesterWaitlist.length} active</Badge>
        </div>
        <ul className="divide-y divide-border/60">
          {requesterWaitlist.map((w) => {
            const promoted = w.status === "promoted";
            return (
              <li key={w.id} className="flex items-center gap-3 py-3">
                <div className={cn(
                  "flex h-11 w-11 shrink-0 flex-col items-center justify-center rounded-2xl text-[10px] font-bold",
                  promoted ? "bg-success/15 text-success" : "bg-muted text-foreground/70",
                )}>
                  <span className="leading-none text-sm">#{w.position}</span>
                  <span className="text-[8px] font-medium opacity-70">of {w.total}</span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{w.event}</p>
                  <p className="truncate text-[11px] text-muted-foreground">{w.venue} · {format(new Date(w.date), "EEE, d MMM")}</p>
                </div>
                <span className={cn(
                  "rounded-full px-2 py-0.5 text-[10px] font-semibold capitalize",
                  promoted ? "bg-success/15 text-success" : "bg-info/15 text-info",
                )}>
                  {promoted ? "Promoted" : "Active"}
                </span>
                <Button size="sm" variant="ghost" className="rounded-full text-xs text-muted-foreground hover:text-foreground">
                  <Clock3 className="mr-1 h-3 w-3" /> Notify me
                </Button>
              </li>
            );
          })}
        </ul>
      </section>
    </RequesterShell>
  );
}
