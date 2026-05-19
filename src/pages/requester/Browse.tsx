import { useMemo, useState } from "react";
import { format, isSameDay, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, addMonths, subMonths, isSameMonth } from "date-fns";
import { Search, LayoutList, CalendarDays, Heart, MapPin, Users, Clock3, ChevronLeft, ChevronRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { RequesterShell } from "@/components/requester/RequesterShell";
import { EventStatusChip } from "@/components/requester/EventStatusChip";
import { EventDiscoverDrawer } from "@/components/requester/EventDiscoverDrawer";
import { discoverEvents, discoverTypes, discoverVenues, DiscoverEvent, DISCOVER_STATUS_LABEL, DiscoverStatus } from "@/data/requesterDiscover";

import { cn } from "@/lib/utils";
import { toast } from "sonner";

type Sort = "date" | "type" | "venue";
type View = "list" | "calendar";

export default function BrowseEvents() {
  const [view, setView] = useState<View>("list");
  const [query, setQuery] = useState("");
  const [venueF, setVenueF] = useState("all");
  const [typeF, setTypeF] = useState("all");
  const [availF, setAvailF] = useState<"all" | DiscoverStatus>("all");
  const [sort, setSort] = useState<Sort>("date");
  const [range, setRange] = useState<{ from?: Date; to?: Date }>({});
  const [wishlist, setWishlist] = useState<Set<string>>(new Set());
  const [selected, setSelected] = useState<DiscoverEvent | null>(null);
  const [open, setOpen] = useState(false);

  const toggleSave = (id: string) => {
    setWishlist((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
        toast.success("Removed from wishlist");
      } else {
        next.add(id);
        toast.success("Saved to wishlist");
      }
      return next;
    });
  };

  const filtered = useMemo(() => {
    let list = discoverEvents;
    if (venueF !== "all") list = list.filter((e) => e.venue === venueF);
    if (typeF !== "all") list = list.filter((e) => e.type === typeF);
    if (availF !== "all") list = list.filter((e) => e.discoverStatus === availF);
    if (range.from) list = list.filter((e) => new Date(e.date) >= range.from!);
    if (range.to) list = list.filter((e) => new Date(e.date) <= range.to!);
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter((e) => e.name.toLowerCase().includes(q) || e.venue.toLowerCase().includes(q) || e.type.toLowerCase().includes(q));
    }
    return [...list].sort((a, b) => {
      if (sort === "type") return a.type.localeCompare(b.type);
      if (sort === "venue") return a.venue.localeCompare(b.venue);
      return +new Date(a.date) - +new Date(b.date);
    });
  }, [query, venueF, typeF, availF, sort, range]);

  const openEvent = (e: DiscoverEvent) => { setSelected(e); setOpen(true); };

  return (
    <RequesterShell>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-semibold tracking-tight">Browse events</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {filtered.length} events available · discover, book, or join the waitlist.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex h-9 items-center gap-1 rounded-full border border-border/60 bg-card p-0.5">
            <ToggleBtn active={view === "list"} onClick={() => setView("list")}>
              <LayoutList className="mr-1.5 h-3.5 w-3.5" /> List
            </ToggleBtn>
            <ToggleBtn active={view === "calendar"} onClick={() => setView("calendar")}>
              <CalendarDays className="mr-1.5 h-3.5 w-3.5" /> Calendar
            </ToggleBtn>
          </div>
        </div>
      </div>

      {/* Sticky filter bar */}
      <div className="sticky top-20 z-20 -mx-1 rounded-2xl border border-border/60 bg-card/95 p-3 shadow-sm backdrop-blur-md sm:p-4">
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative min-w-[180px] flex-1 sm:flex-none sm:w-72">
            <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search events, venues, type…"
              className="h-9 rounded-full border-border/60 bg-secondary/60 pl-9 text-xs"
            />
          </div>

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="h-9 rounded-full text-xs">
                <CalendarDays className="mr-1.5 h-3.5 w-3.5" />
                {range.from && range.to
                  ? `${format(range.from, "d MMM")} – ${format(range.to, "d MMM")}`
                  : range.from ? `From ${format(range.from, "d MMM")}` : "Date range"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="range"
                selected={range as any}
                onSelect={(r: any) => setRange(r ?? {})}
                numberOfMonths={2}
                className={cn("p-3 pointer-events-auto")}
              />
              <div className="flex justify-end border-t border-border/60 px-3 py-2">
                <Button size="sm" variant="ghost" className="text-xs" onClick={() => setRange({})}>Clear</Button>
              </div>
            </PopoverContent>
          </Popover>

          <Select value={venueF} onValueChange={setVenueF}>
            <SelectTrigger className="h-9 w-44 rounded-full border-border/60 text-xs"><SelectValue placeholder="Venue" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All venues</SelectItem>
              {discoverVenues.map((v) => <SelectItem key={v} value={v}>{v}</SelectItem>)}
            </SelectContent>
          </Select>

          <Select value={typeF} onValueChange={setTypeF}>
            <SelectTrigger className="h-9 w-36 rounded-full border-border/60 text-xs"><SelectValue placeholder="Type" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All types</SelectItem>
              {discoverTypes.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
            </SelectContent>
          </Select>

          <Select value={availF} onValueChange={(v) => setAvailF(v as any)}>
            <SelectTrigger className="h-9 w-44 rounded-full border-border/60 text-xs"><SelectValue placeholder="Availability" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All availability</SelectItem>
              {Object.entries(DISCOVER_STATUS_LABEL).map(([k, v]) => (
                <SelectItem key={k} value={k}>{v}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="ml-auto flex items-center gap-1.5">
            <span className="text-[11px] text-muted-foreground">Sort by</span>
            <Select value={sort} onValueChange={(v) => setSort(v as Sort)}>
              <SelectTrigger className="h-9 w-32 rounded-full border-border/60 text-xs"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="date">Date</SelectItem>
                <SelectItem value="type">Event type</SelectItem>
                <SelectItem value="venue">Venue name</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {view === "list" ? (
        <ListView events={filtered} wishlist={wishlist} onToggleSave={toggleSave} onOpen={openEvent} />
      ) : (
        <CalendarView events={filtered} onOpen={openEvent} />
      )}

      <EventDiscoverDrawer
        event={selected}
        open={open}
        onOpenChange={setOpen}
        saved={selected ? wishlist.has(selected.id) : false}
        onToggleSave={() => selected && toggleSave(selected.id)}
      />
    </RequesterShell>
  );
}

function ToggleBtn({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "inline-flex h-8 items-center rounded-full px-3 text-xs font-medium transition-colors",
        active ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground",
      )}
    >
      {children}
    </button>
  );
}

/* ---------------- List ---------------- */

function ListView({ events, wishlist, onToggleSave, onOpen }: {
  events: DiscoverEvent[]; wishlist: Set<string>; onToggleSave: (id: string) => void; onOpen: (e: DiscoverEvent) => void;
}) {
  if (events.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card/50 px-6 py-16 text-center">
        <h3 className="text-lg font-semibold">No events match your filters</h3>
        <p className="mt-1 max-w-sm text-sm text-muted-foreground">Try widening the date range or clearing filters.</p>
      </div>
    );
  }
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
      {events.map((e) => {
        const saved = wishlist.has(e.id);
        return (
          <div key={e.id} className="group relative flex flex-col rounded-3xl border border-border/60 bg-card/90 p-5 shadow-sm transition-all hover:border-primary/30 hover:shadow-soft">
            <button
              aria-label={saved ? "Remove from wishlist" : "Save to wishlist"}
              onClick={() => onToggleSave(e.id)}
              className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full border border-border/60 bg-card/90 transition-colors hover:bg-accent"
            >
              <Heart className={cn("h-4 w-4", saved ? "fill-primary text-primary" : "text-muted-foreground")} />
            </button>
            <button onClick={() => onOpen(e)} className="text-left">
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-secondary px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-secondary-foreground">
                  {e.type}
                </span>
                <EventStatusChip s={e.discoverStatus} />
              </div>
              <h3 className="mt-3 truncate pr-8 text-base font-semibold text-foreground">{e.name}</h3>
              <div className="mt-2 space-y-1 text-xs text-muted-foreground">
                <div className="inline-flex items-center gap-1.5"><CalendarDays className="h-3.5 w-3.5" />{format(new Date(e.date), "EEE, d MMM · HH:mm")}</div>
                <div className="block"><MapPin className="mr-1.5 inline h-3.5 w-3.5" />{e.venue}</div>
                <div className="inline-flex items-center gap-1.5"><Users className="h-3.5 w-3.5" />{e.seatsAvailable} of {e.capacity} seats available</div>
              </div>
            </button>
            <div className="mt-4 flex items-center gap-1.5 border-t border-border/60 pt-3">
              <Button size="sm" className="h-7 flex-1 rounded-full text-[11px]" onClick={() => onOpen(e)}>
                {e.discoverStatus === "full_waitlist" || e.discoverStatus === "waitlisted"
                  ? "Join waitlist"
                  : e.discoverStatus === "closed"
                    ? "View details"
                    : "Book now"}
              </Button>
              <Button size="sm" variant="ghost" className="h-7 rounded-full text-[11px]" onClick={() => onOpen(e)}>
                Details
              </Button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ---------------- Calendar ---------------- */

function CalendarView({ events, onOpen }: { events: DiscoverEvent[]; onOpen: (e: DiscoverEvent) => void }) {
  const [cursor, setCursor] = useState(new Date());
  const monthStart = startOfMonth(cursor);
  const monthEnd = endOfMonth(cursor);
  const gridStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const gridEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });

  const days: Date[] = [];
  for (let d = gridStart; d <= gridEnd; d = addDays(d, 1)) days.push(d);

  const eventsForDay = (d: Date) => events.filter((e) => isSameDay(new Date(e.date), d));

  return (
    <div className="rounded-3xl border border-border/60 bg-card/90 p-4 shadow-sm sm:p-5">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-display text-lg font-semibold">{format(cursor, "MMMM yyyy")}</h2>
        <div className="flex items-center gap-1">
          <Button variant="outline" size="icon" className="h-8 w-8 rounded-full" onClick={() => setCursor(subMonths(cursor, 1))}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" className="h-8 rounded-full text-xs" onClick={() => setCursor(new Date())}>Today</Button>
          <Button variant="outline" size="icon" className="h-8 w-8 rounded-full" onClick={() => setCursor(addMonths(cursor, 1))}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
        {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
          <div key={d} className="px-2 py-1.5">{d}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {days.map((d) => {
          const dayEvents = eventsForDay(d);
          const inMonth = isSameMonth(d, cursor);
          const isToday = isSameDay(d, new Date());
          return (
            <div
              key={d.toISOString()}
              className={cn(
                "min-h-[92px] rounded-xl border p-1.5 transition-colors",
                inMonth ? "border-border/60 bg-card" : "border-transparent bg-muted/30",
              )}
            >
              <div className="flex items-center justify-between">
                <span className={cn(
                  "flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-semibold",
                  isToday ? "bg-primary text-primary-foreground" : inMonth ? "text-foreground" : "text-muted-foreground",
                )}>
                  {format(d, "d")}
                </span>
                {dayEvents.length > 2 && (
                  <span className="text-[9px] font-medium text-muted-foreground">+{dayEvents.length - 2}</span>
                )}
              </div>
              <div className="mt-1 space-y-1">
                {dayEvents.slice(0, 2).map((e) => (
                  <button
                    key={e.id}
                    onClick={() => onOpen(e)}
                    className={cn(
                      "block w-full truncate rounded-md px-1.5 py-0.5 text-left text-[10px] font-medium transition-colors",
                      availabilityDot(e.discoverStatus),
                    )}
                    title={`${e.name} · ${e.venue}`}
                  >
                    {format(new Date(e.date), "HH:mm")} {e.name}
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 border-t border-border/60 pt-3 text-[10px] text-muted-foreground">
        <Legend className="bg-[hsl(140_55%_92%)] text-[hsl(140_55%_30%)]">Available</Legend>
        <Legend className="bg-[hsl(45_95%_92%)] text-[hsl(35_85%_40%)]">Limited</Legend>
        <Legend className="bg-[hsl(280_70%_94%)] text-[hsl(280_60%_45%)]">Full / Waitlist</Legend>
        <Legend className="bg-[hsl(220_85%_94%)] text-[hsl(220_85%_45%)]">Waitlisted</Legend>
        <Legend className="bg-[hsl(220_10%_94%)] text-[hsl(220_10%_45%)]">Closed</Legend>
      </div>
    </div>
  );
}

function availabilityDot(s: DiscoverStatus): string {
  switch (s) {
    case "available": return "bg-[hsl(140_55%_92%)] text-[hsl(140_55%_30%)] hover:bg-[hsl(140_55%_88%)]";
    case "limited": return "bg-[hsl(45_95%_92%)] text-[hsl(35_85%_40%)] hover:bg-[hsl(45_95%_88%)]";
    case "full_waitlist": return "bg-[hsl(280_70%_94%)] text-[hsl(280_60%_45%)] hover:bg-[hsl(280_70%_90%)]";
    case "waitlisted": return "bg-[hsl(220_85%_94%)] text-[hsl(220_85%_45%)] hover:bg-[hsl(220_85%_90%)]";
    case "closed": return "bg-[hsl(220_10%_94%)] text-[hsl(220_10%_45%)] hover:bg-[hsl(220_10%_90%)]";
  }
}

function Legend({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <span className={cn("inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-semibold", className)}>
      <Clock3 className="h-2.5 w-2.5" /> {children}
    </span>
  );
}
