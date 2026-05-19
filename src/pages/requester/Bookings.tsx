import { useMemo, useState } from "react";
import { format } from "date-fns";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RequesterShell } from "@/components/requester/RequesterShell";
import { requesterBookings, RequesterBooking, BOOKING_STATUS_LABEL, BookingStatus } from "@/data/requester";
import { BookingStatusChip } from "@/components/requester/StatusChip";
import { BookingDrawer } from "@/components/requester/BookingDrawer";
import { cn } from "@/lib/utils";

export default function RequesterBookings() {
  const [query, setQuery] = useState("");
  const [statusF, setStatusF] = useState<string>("all");
  const [scope, setScope] = useState<"all" | "upcoming" | "past">("upcoming");
  const [selected, setSelected] = useState<RequesterBooking | null>(null);
  const [open, setOpen] = useState(false);

  const filtered = useMemo(() => {
    let list = requesterBookings;
    if (scope === "upcoming") list = list.filter((b) => !b.past);
    if (scope === "past") list = list.filter((b) => b.past);
    if (statusF !== "all") list = list.filter((b) => b.status === statusF);
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (b) => b.eventName.toLowerCase().includes(q) || b.venue.toLowerCase().includes(q) || b.ref.toLowerCase().includes(q),
      );
    }
    return [...list].sort((a, b) => +new Date(a.date) - +new Date(b.date));
  }, [query, statusF, scope]);

  const openBooking = (b: RequesterBooking) => { setSelected(b); setOpen(true); };

  return (
    <RequesterShell>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-semibold tracking-tight">My bookings</h1>
          <p className="mt-1 text-sm text-muted-foreground">{filtered.length} bookings · personal scope only.</p>
        </div>
      </div>

      <div className="rounded-2xl border border-border/60 bg-card/90 p-3 shadow-sm sm:p-4">
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative flex-1 sm:flex-none sm:w-64">
            <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search bookings"
              className="h-9 rounded-full border-border/60 bg-secondary/60 pl-9 text-xs"
            />
          </div>
          <Select value={statusF} onValueChange={setStatusF}>
            <SelectTrigger className="h-9 w-40 rounded-full border-border/60 bg-card text-xs"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              {Object.entries(BOOKING_STATUS_LABEL).map(([k, v]) => (
                <SelectItem key={k} value={k}>{v}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={scope} onValueChange={(v) => setScope(v as any)}>
            <SelectTrigger className="h-9 w-36 rounded-full border-border/60 bg-card text-xs"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="upcoming">Upcoming</SelectItem>
              <SelectItem value="past">Past</SelectItem>
              <SelectItem value="all">All</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="-mx-3 mt-4 overflow-x-auto sm:mx-0">
          <div className="min-w-[820px] sm:min-w-0">
            <div className="grid grid-cols-[110px_1.4fr_1fr_120px_70px_140px] items-center gap-3 border-b border-border/60 px-3 py-3 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
              <span>Ref</span>
              <span>Event</span>
              <span>Date</span>
              <span>Venue</span>
              <span>Guests</span>
              <span>Status</span>
            </div>
            {filtered.length === 0 && (
              <div className="px-3 py-10 text-center text-sm text-muted-foreground">No bookings match your filters.</div>
            )}
            {filtered.map((b, i) => (
              <button
                key={b.id}
                onClick={() => openBooking(b)}
                className={cn(
                  "grid w-full grid-cols-[110px_1.4fr_1fr_120px_70px_140px] items-center gap-3 rounded-xl px-3 py-3 text-left text-sm transition-colors",
                  i % 2 === 1 ? "bg-secondary/40" : "hover:bg-secondary/40",
                )}
              >
                <span className="font-medium tabular-nums">{b.ref}</span>
                <span className="truncate font-medium">{b.eventName}</span>
                <span className="text-xs text-muted-foreground">{format(new Date(b.date), "EEE, d MMM · HH:mm")}</span>
                <span className="truncate text-xs text-muted-foreground">{b.venue}</span>
                <span className="tabular-nums text-xs text-muted-foreground">{b.guestCount}</span>
                <BookingStatusChip s={b.status as BookingStatus} />
              </button>
            ))}
          </div>
        </div>
      </div>

      <BookingDrawer booking={selected} open={open} onOpenChange={setOpen} />
    </RequesterShell>
  );
}
