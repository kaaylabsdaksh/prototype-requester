import { useMemo, useState } from "react";
import { CalendarCheck, Inbox, Clock3, MapPin, Users, Plus, Send, Eye, Ban, Heart, ChevronRight, Sparkles } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { RequesterShell } from "@/components/requester/RequesterShell";
import {
  requesterBookings, requesterEnquiries, requesterWishlist, requesterWaitlist,
  entitlement, requesterProfile, RequesterBooking, RequesterEnquiry,
} from "@/data/requester";
import { BookingStatusChip, EnquiryStatusChip } from "@/components/requester/StatusChip";
import { BookingDrawer } from "@/components/requester/BookingDrawer";
import { EnquiryDrawer } from "@/components/requester/EnquiryDrawer";
import { EntitlementWidget } from "@/components/requester/EntitlementWidget";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { openEnquiry as openEnquiryDialog } from "@/components/requester/SubmitEnquiryDialog";

export default function RequesterDashboard() {
  const [scope, setScope] = useState<"upcoming" | "past">("upcoming");
  const [booking, setBooking] = useState<RequesterBooking | null>(null);
  const [bookingOpen, setBookingOpen] = useState(false);
  const [enquiry, setEnquiry] = useState<RequesterEnquiry | null>(null);
  const [enquiryOpen, setEnquiryOpen] = useState(false);

  const bookings = useMemo(
    () => requesterBookings.filter((b) => (scope === "past" ? b.past : !b.past)),
    [scope],
  );

  const upcomingCount = requesterBookings.filter((b) => !b.past && b.status === "confirmed").length;
  const pendingApprovals = requesterBookings.filter((b) => b.status === "pending_approval").length;
  const activeEnquiries = requesterEnquiries.filter((e) => ["submitted", "in_progress", "proposal_received"].includes(e.status)).length;

  const openBooking = (b: RequesterBooking) => { setBooking(b); setBookingOpen(true); };
  const openEnquiry = (e: RequesterEnquiry) => { setEnquiry(e); setEnquiryOpen(true); };

  return (
    <RequesterShell>
      {/* Hero */}
      <section className="relative overflow-hidden rounded-[1.5rem] border border-border/60 bg-gradient-hero p-5 shadow-panel sm:rounded-[2rem] sm:p-6 md:p-8">
        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-primary/15 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 left-1/3 h-72 w-72 rounded-full bg-info/15 blur-3xl" />

        <div className="relative flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-xs text-foreground/60 sm:text-sm">
              {new Date().toLocaleDateString(undefined, { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
            </p>
            <h1 className="mt-1 font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl md:text-4xl">
              Welcome back, {requesterProfile.name.split(" ")[0]}
            </h1>
            <p className="mt-1.5 text-sm text-foreground/60">Here's what's happening with your bookings today.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button size="sm" variant="outline" className="rounded-full border-border/70 bg-card/70 backdrop-blur sm:size-default">
              <Heart className="mr-1.5 h-4 w-4" /> Wishlist
              <Badge className="ml-2 h-5 bg-primary text-primary-foreground">{requesterWishlist.length}</Badge>
            </Button>
            <Button size="sm" className="rounded-full bg-foreground text-background hover:bg-foreground/90 sm:size-default" onClick={openEnquiryDialog}>
              <Plus className="mr-1.5 h-4 w-4" /> New Enquiry
            </Button>
          </div>
        </div>

        {/* Summary stats */}
        <div className="relative mt-7 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <SummaryCard icon={CalendarCheck} label="Upcoming events" value={upcomingCount} sub="confirmed bookings" tone="success" />
          <SummaryCard icon={Clock3} label="Pending approvals" value={pendingApprovals} sub="awaiting CEM review" tone="warning" />
          <SummaryCard icon={Inbox} label="Active enquiries" value={activeEnquiries} sub="in progress" tone="info" />
        </div>
      </section>

      {/* Upcoming/Past toggle + Bookings */}
      <section className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-display text-xl font-semibold tracking-tight">My bookings</h2>
            <p className="text-xs text-muted-foreground">Confirmed, pending and waitlisted events.</p>
          </div>
          <div className="flex h-9 items-center gap-2 rounded-full border border-border/60 bg-card px-3">
            <Label htmlFor="req-scope" className="text-xs text-muted-foreground">
              {scope === "upcoming" ? "Upcoming" : "Past"}
            </Label>
            <Switch id="req-scope" checked={scope === "past"} onCheckedChange={(v) => setScope(v ? "past" : "upcoming")} />
          </div>
        </div>

        {bookings.length === 0 ? (
          <EmptyState
            title={scope === "past" ? "No past bookings" : "No upcoming bookings"}
            body={scope === "past" ? "Past events will appear here once attended." : "Submit an enquiry to start booking your next event."}
          />
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {bookings.map((b) => (
              <BookingCard key={b.id} booking={b} onOpen={() => openBooking(b)} />
            ))}
          </div>
        )}
      </section>

      {/* Enquiries */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-xl font-semibold tracking-tight">Active enquiries</h2>
          <Button size="sm" variant="ghost" className="rounded-full text-xs text-muted-foreground hover:text-foreground">
            View all <ChevronRight className="ml-0.5 h-3.5 w-3.5" />
          </Button>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {requesterEnquiries
            .filter((e) => ["submitted", "in_progress", "proposal_received"].includes(e.status))
            .map((e) => (
              <button
                key={e.id}
                onClick={() => openEnquiry(e)}
                className="group rounded-2xl border border-border/60 bg-card/90 p-4 text-left transition-all hover:border-primary/30 hover:shadow-soft"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">{e.ref}</p>
                    <p className="mt-0.5 text-sm font-semibold">{e.eventType}</p>
                  </div>
                  <EnquiryStatusChip s={e.status} />
                </div>
                <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-muted-foreground">
                  <span className="inline-flex items-center gap-1"><Users className="h-3 w-3" /> {e.guests}</span>
                  <span className="inline-flex items-center gap-1"><MapPin className="h-3 w-3" /> {e.location}</span>
                  <span>· Submitted {format(new Date(e.submittedAt), "PP")}</span>
                </div>
              </button>
            ))}
        </div>
      </section>

      {/* Wishlist & Waitlist */}
      <section className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Wishlist */}
        <div className="rounded-3xl border border-border/60 bg-card/90 p-5 shadow-sm">
          <div className="mb-3 flex items-center justify-between">
            <div>
              <h3 className="font-display text-base font-semibold">Wishlist</h3>
              <p className="text-[11px] text-muted-foreground">Saved events you're considering.</p>
            </div>
            <Sparkles className="h-4 w-4 text-primary" />
          </div>
          <ul className="divide-y divide-border/60">
            {requesterWishlist.map((w) => (
              <li key={w.id} className="flex items-center gap-3 py-2.5">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-accent text-accent-foreground">
                  <Heart className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{w.event}</p>
                  <p className="truncate text-[11px] text-muted-foreground">{w.venue} · {format(new Date(w.date), "d MMM")}</p>
                </div>
                <Badge variant="outline" className="text-[10px]">{w.category}</Badge>
              </li>
            ))}
          </ul>
        </div>

        {/* Waitlist */}
        <div className="rounded-3xl border border-border/60 bg-card/90 p-5 shadow-sm">
          <div className="mb-3 flex items-center justify-between">
            <div>
              <h3 className="font-display text-base font-semibold">Waitlist</h3>
              <p className="text-[11px] text-muted-foreground">Your queued requests across events.</p>
            </div>
            <Clock3 className="h-4 w-4 text-info" />
          </div>
          <ul className="divide-y divide-border/60">
            {requesterWaitlist.map((w) => {
              const promoted = w.status === "promoted";
              return (
                <li key={w.id} className="flex items-center gap-3 py-2.5">
                  <div className={cn(
                    "flex h-9 w-9 shrink-0 flex-col items-center justify-center rounded-xl text-[10px] font-bold",
                    promoted ? "bg-success/15 text-success" : "bg-muted text-foreground/70",
                  )}>
                    <span className="leading-none">#{w.position}</span>
                    <span className="text-[8px] font-medium opacity-70">of {w.total}</span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{w.event}</p>
                    <p className="truncate text-[11px] text-muted-foreground">{w.venue} · {format(new Date(w.date), "d MMM")}</p>
                  </div>
                  <span className={cn(
                    "rounded-full px-2 py-0.5 text-[10px] font-semibold capitalize",
                    promoted ? "bg-success/15 text-success" : "bg-info/15 text-info",
                  )}>
                    {w.status === "promoted" ? "Promoted" : "Active"}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      <BookingDrawer booking={booking} open={bookingOpen} onOpenChange={setBookingOpen} />
      <EnquiryDrawer enquiry={enquiry} open={enquiryOpen} onOpenChange={setEnquiryOpen} />
    </RequesterShell>
  );
}

/* ---------- pieces ---------- */

function SummaryCard({
  icon: Icon, label, value, sub, tone,
}: { icon: any; label: string; value: number; sub: string; tone: "success" | "warning" | "info" }) {
  const toneMap = {
    success: "bg-success/10 text-success",
    warning: "bg-warning/15 text-warning",
    info: "bg-info/10 text-info",
  };
  return (
    <div className="group rounded-3xl border border-border/60 bg-card/85 p-5 backdrop-blur-sm transition-all hover:border-primary/30 hover:shadow-soft">
      <div className="flex items-start justify-between">
        <div className={cn("flex h-11 w-11 items-center justify-center rounded-2xl", toneMap[tone])}>
          <Icon className="h-5 w-5" strokeWidth={1.75} />
        </div>
        <span className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">Live</span>
      </div>
      <div className="mt-4">
        <p className="text-3xl font-bold tabular-nums leading-none">{value}</p>
        <p className="mt-1.5 text-sm font-medium text-foreground">{label}</p>
        <p className="text-[11px] text-muted-foreground">{sub}</p>
      </div>
    </div>
  );
}

function BookingCard({ booking, onOpen }: { booking: RequesterBooking; onOpen: () => void }) {
  const total = booking.rsvp.accepted + booking.rsvp.declined + booking.rsvp.pending;
  const pct = (n: number) => (total ? Math.round((n / total) * 100) : 0);
  return (
    <div className="group flex flex-col rounded-3xl border border-border/60 bg-card/90 p-5 shadow-sm transition-all hover:border-primary/30 hover:shadow-soft">
      <button onClick={onOpen} className="text-left">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">{booking.ref}</p>
            <h3 className="mt-0.5 truncate text-base font-semibold text-foreground">{booking.eventName}</h3>
          </div>
          <BookingStatusChip s={booking.status} />
        </div>
        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-muted-foreground">
          <div className="inline-flex items-center gap-1.5"><CalendarCheck className="h-3.5 w-3.5" />{format(new Date(booking.date), "EEE, d MMM · HH:mm")}</div>
          <div className="inline-flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" />{booking.venue}</div>
          <div className="inline-flex items-center gap-1.5"><Users className="h-3.5 w-3.5" />{booking.guestCount} guests</div>
        </div>

        <div className="mt-4">
          <div className="flex h-1.5 w-full overflow-hidden rounded-full bg-muted">
            <div className="bg-success" style={{ width: `${pct(booking.rsvp.accepted)}%` }} />
            <div className="bg-warning" style={{ width: `${pct(booking.rsvp.pending)}%` }} />
            <div className="bg-destructive" style={{ width: `${pct(booking.rsvp.declined)}%` }} />
          </div>
          <div className="mt-1.5 flex items-center gap-3 text-[10px] text-muted-foreground">
            <span className="inline-flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-success" /> {booking.rsvp.accepted} accepted</span>
            <span className="inline-flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-warning" /> {booking.rsvp.pending} pending</span>
            <span className="inline-flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-destructive" /> {booking.rsvp.declined} declined</span>
          </div>
        </div>
      </button>

      <div className="mt-4 flex flex-wrap items-center gap-1.5 border-t border-border/60 pt-3">
        <Button size="sm" variant="ghost" className="h-7 rounded-full px-2.5 text-[11px]" onClick={() => toast.success("Add guests dialog")}>
          <Plus className="mr-1 h-3 w-3" /> Add
        </Button>
        <Button size="sm" variant="ghost" className="h-7 rounded-full px-2.5 text-[11px]" onClick={() => toast.success("Invites resent")}>
          <Send className="mr-1 h-3 w-3" /> Resend
        </Button>
        <Button size="sm" variant="ghost" className="h-7 rounded-full px-2.5 text-[11px]" onClick={onOpen}>
          <Eye className="mr-1 h-3 w-3" /> View
        </Button>
        {booking.status !== "cancelled" && !booking.past && (
          <Button size="sm" variant="ghost" className="ml-auto h-7 rounded-full px-2.5 text-[11px] text-destructive hover:text-destructive" onClick={() => toast.success("Cancellation requested")}>
            <Ban className="mr-1 h-3 w-3" /> Cancel
          </Button>
        )}
      </div>
    </div>
  );
}

function EmptyState({ title, body }: { title: string; body: string }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card/50 px-6 py-16 text-center">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-accent text-accent-foreground">
        <CalendarCheck className="h-6 w-6" />
      </div>
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="mt-1 max-w-sm text-sm text-muted-foreground">{body}</p>
    </div>
  );
}
