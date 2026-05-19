import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { RequesterBooking } from "@/data/requester";
import { BookingStatusChip } from "./StatusChip";
import { CalendarDays, MapPin, Users, Mail, X, Plus, Send, Ban } from "lucide-react";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface Props {
  booking: RequesterBooking | null;
  open: boolean;
  onOpenChange: (v: boolean) => void;
}

export function BookingDrawer({ booking, open, onOpenChange }: Props) {
  if (!booking) return null;
  const total = booking.rsvp.accepted + booking.rsvp.declined + booking.rsvp.pending;
  const pct = (n: number) => (total ? Math.round((n / total) * 100) : 0);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full overflow-y-auto sm:max-w-xl">
        <SheetHeader>
          <SheetDescription className="text-xs uppercase tracking-wide">{booking.ref}</SheetDescription>
          <SheetTitle className="flex flex-wrap items-center gap-3 text-2xl leading-tight">
            {booking.eventName}
            <BookingStatusChip s={booking.status} />
          </SheetTitle>
        </SheetHeader>

        <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
          <Field icon={<CalendarDays className="h-4 w-4" />} label="Date" value={format(new Date(booking.date), "PPp")} />
          <Field icon={<MapPin className="h-4 w-4" />} label="Venue" value={booking.venue} />
          <Field icon={<Users className="h-4 w-4" />} label="Guest count" value={String(booking.guestCount)} />
          <Field icon={<Mail className="h-4 w-4" />} label="Type" value={booking.type} />
        </div>

        {booking.notes && (
          <div className="mt-4 rounded-xl border border-black/5 bg-[hsl(220_20%_98%)] p-3 text-sm text-foreground/80">
            {booking.notes}
          </div>
        )}

        {/* RSVP breakdown */}
        <div className="mt-6">
          <h4 className="text-sm font-semibold">RSVP breakdown</h4>
          <div className="mt-3 flex h-2.5 w-full overflow-hidden rounded-full bg-muted">
            <div className="bg-success" style={{ width: `${pct(booking.rsvp.accepted)}%` }} />
            <div className="bg-warning" style={{ width: `${pct(booking.rsvp.pending)}%` }} />
            <div className="bg-destructive" style={{ width: `${pct(booking.rsvp.declined)}%` }} />
          </div>
          <div className="mt-2 grid grid-cols-3 gap-2 text-xs">
            <RsvpStat dotClass="bg-success" label="Accepted" value={booking.rsvp.accepted} />
            <RsvpStat dotClass="bg-warning" label="Pending" value={booking.rsvp.pending} />
            <RsvpStat dotClass="bg-destructive" label="Declined" value={booking.rsvp.declined} />
          </div>
        </div>

        {/* Guest list */}
        <div className="mt-6">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-semibold">Guests</h4>
            <span className="text-[11px] text-muted-foreground">{booking.guests.length} total</span>
          </div>
          <ul className="mt-2 divide-y divide-black/5 rounded-xl border border-black/5 bg-card">
            {booking.guests.length === 0 && (
              <li className="px-3 py-4 text-center text-xs text-muted-foreground">No guests added yet.</li>
            )}
            {booking.guests.map((g) => (
              <li key={g.id} className="flex items-center gap-3 px-3 py-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary text-[11px] font-semibold">
                  {g.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-xs font-medium">{g.name}</div>
                  <div className="truncate text-[11px] text-muted-foreground">{g.email}</div>
                </div>
                <span className={cn(
                  "rounded-full px-2 py-0.5 text-[10px] font-semibold capitalize",
                  g.rsvp === "accepted" && "bg-success/15 text-success",
                  g.rsvp === "pending" && "bg-warning/15 text-warning",
                  g.rsvp === "declined" && "bg-destructive/15 text-destructive",
                )}>
                  {g.rsvp}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Activity */}
        <div className="mt-6">
          <h4 className="text-sm font-semibold">Activity</h4>
          <ul className="mt-2 space-y-2">
            {[...booking.activity].reverse().map((a, i) => (
              <li key={i} className="flex items-start gap-2 text-xs">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-foreground/30" />
                <div>
                  <span className="text-foreground/80">{a.text}</span>
                  <span className="ml-2 text-foreground/40">{format(new Date(a.at), "PP")}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Actions */}
        <div className="mt-6 flex flex-wrap gap-2">
          <Button size="sm" className="rounded-full" onClick={() => toast.success("Add guests dialog")}>
            <Plus className="mr-1.5 h-3.5 w-3.5" /> Add guests
          </Button>
          <Button size="sm" variant="outline" className="rounded-full" onClick={() => toast.success("Invites resent")}>
            <Send className="mr-1.5 h-3.5 w-3.5" /> Resend invite
          </Button>
          {booking.status !== "cancelled" && (
            <Button size="sm" variant="outline" className="rounded-full text-destructive hover:text-destructive" onClick={() => toast.success("Cancellation requested")}>
              <Ban className="mr-1.5 h-3.5 w-3.5" /> Cancel booking
            </Button>
          )}
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

function RsvpStat({ dotClass, label, value }: { dotClass: string; label: string; value: number }) {
  return (
    <div className="rounded-lg border border-black/5 bg-card px-2 py-1.5">
      <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
        <span className={cn("h-2 w-2 rounded-full", dotClass)} /> {label}
      </div>
      <div className="mt-0.5 text-sm font-semibold tabular-nums">{value}</div>
    </div>
  );
}
