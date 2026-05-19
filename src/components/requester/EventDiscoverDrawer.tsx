import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { DiscoverEvent } from "@/data/requesterDiscover";
import { EventStatusChip } from "./EventStatusChip";
import { CalendarDays, MapPin, Users, Shirt, Clock3, ShieldCheck, Heart } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface Props {
  event: DiscoverEvent | null;
  open: boolean;
  onOpenChange: (v: boolean) => void;
  saved: boolean;
  onToggleSave: () => void;
}

export function EventDiscoverDrawer({ event, open, onOpenChange, saved, onToggleSave }: Props) {
  if (!event) return null;
  const fillPct = Math.round((event.booked / event.capacity) * 100);
  const isFull = event.discoverStatus === "full_waitlist" || event.discoverStatus === "waitlisted";
  const closed = event.discoverStatus === "closed";

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full overflow-y-auto sm:max-w-xl">
        <SheetHeader>
          <SheetDescription className="text-xs uppercase tracking-wide">{event.type}</SheetDescription>
          <SheetTitle className="flex flex-wrap items-center gap-3 text-2xl leading-tight">
            {event.name}
            <EventStatusChip s={event.discoverStatus} />
          </SheetTitle>
        </SheetHeader>

        <p className="mt-4 text-sm leading-relaxed text-foreground/80">{event.description}</p>

        <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
          <Field icon={<CalendarDays className="h-4 w-4" />} label="Date & time" value={format(new Date(event.date), "PPp")} />
          <Field icon={<MapPin className="h-4 w-4" />} label="Venue" value={event.venue} />
          <Field icon={<Users className="h-4 w-4" />} label="Capacity" value={`${event.capacity} (${event.seatsAvailable} left)`} />
          <Field icon={<Shirt className="h-4 w-4" />} label="Dress code" value={event.dressCode} />
          <Field icon={<Clock3 className="h-4 w-4" />} label="Booking deadline" value={format(new Date(event.bookingDeadline), "PP")} />
          <Field icon={<ShieldCheck className="h-4 w-4" />} label="Guest rules" value={event.guestRules} />
        </div>

        <div className="mt-5">
          <div className="mb-1.5 flex items-center justify-between text-[11px] text-muted-foreground">
            <span>Availability</span>
            <span>{event.booked}/{event.capacity} booked</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
            <div
              className={cn("h-full rounded-full", fillPct >= 90 ? "bg-destructive" : fillPct >= 70 ? "bg-warning" : "bg-success")}
              style={{ width: `${Math.min(100, fillPct)}%` }}
            />
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-2">
          {!closed && !isFull && (
            <Button className="rounded-full" onClick={() => toast.success(`Booking submitted for ${event.name}`)}>
              Book now
            </Button>
          )}
          {isFull && (
            <Button className="rounded-full" onClick={() => toast.success(`Joined waitlist for ${event.name}`)}>
              Join waitlist
            </Button>
          )}
          {closed && (
            <Button className="rounded-full" disabled>
              Booking closed
            </Button>
          )}
          <Button variant="outline" className="rounded-full" onClick={onToggleSave}>
            <Heart className={cn("mr-1.5 h-4 w-4", saved && "fill-primary text-primary")} />
            {saved ? "Saved" : "Save to wishlist"}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}

function Field({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-xl border border-black/5 bg-card p-3">
      <div className="flex items-center gap-1.5 text-[11px] uppercase tracking-wide text-muted-foreground">
        {icon} {label}
      </div>
      <div className="mt-1 text-sm font-medium text-foreground">{value}</div>
    </div>
  );
}
