import { events as portfolioEvents, PortfolioEvent } from "./portfolio";

export type DiscoverStatus = "available" | "limited" | "full_waitlist" | "waitlisted" | "closed";

export const DISCOVER_STATUS_LABEL: Record<DiscoverStatus, string> = {
  available: "Available",
  limited: "Limited Seats",
  full_waitlist: "Full — Join Waitlist",
  waitlisted: "Waitlisted",
  closed: "Booking Closed",
};

export interface DiscoverEvent extends PortfolioEvent {
  description: string;
  dressCode: string;
  bookingDeadline: string;
  guestRules: string;
  seatsAvailable: number;
  discoverStatus: DiscoverStatus;
}

const DRESS: Record<PortfolioEvent["type"], string> = {
  Conference: "Business",
  Workshop: "Smart casual",
  Networking: "Smart casual",
  Webinar: "No requirement",
  Gala: "Black tie",
};

const RULES: Record<PortfolioEvent["type"], string> = {
  Conference: "Up to 4 colleagues per requester.",
  Workshop: "1 attendee per requester. No external guests.",
  Networking: "Up to 2 colleagues per requester.",
  Webinar: "Unlimited internal guests.",
  Gala: "Strictly +1 per requester. RSVP required 7 days prior.",
};

const desc = (e: PortfolioEvent) => {
  const map: Partial<Record<string, string>> = {
    Conference: `${e.name} brings together leaders, practitioners and partners for a day of keynotes, panels and curated networking at ${e.venue}.`,
    Workshop: `An interactive, hands-on session at ${e.venue}. Small-group format with practical exercises and take-home frameworks.`,
    Networking: `Curated networking evening at ${e.venue}. Light refreshments served. Smart casual attire.`,
    Webinar: `Live online session streamed from ${e.venue}. Recording available to attendees afterwards.`,
    Gala: `A premier black-tie evening at ${e.venue} featuring a seated dinner, awards ceremony and live entertainment.`,
  };
  return map[e.type] || "";
};

const today = Date.now();

const toDiscoverStatus = (e: PortfolioEvent): DiscoverStatus => {
  const seats = e.capacity - e.booked;
  const days = Math.ceil((new Date(e.date).getTime() - today) / 86400000);
  if (e.status === "cancelled" || days < 0) return "closed";
  if (e.status === "waitlisted") return "waitlisted";
  if (seats <= 0) return "full_waitlist";
  if (seats / e.capacity < 0.15) return "limited";
  return "available";
};

const deadline = (iso: string) => {
  const dt = new Date(iso);
  dt.setDate(dt.getDate() - 5);
  return dt.toISOString();
};

export const discoverEvents: DiscoverEvent[] = portfolioEvents
  .filter((e) => !e.past)
  .map((e) => ({
    ...e,
    description: desc(e),
    dressCode: DRESS[e.type],
    bookingDeadline: deadline(e.date),
    guestRules: RULES[e.type],
    seatsAvailable: Math.max(0, e.capacity - e.booked),
    discoverStatus: toDiscoverStatus(e),
  }));

export const discoverVenues = Array.from(new Set(discoverEvents.map((e) => e.venue)));
export const discoverTypes = Array.from(new Set(discoverEvents.map((e) => e.type)));

export const ENQUIRY_OPEN_EVENT = "requester:open-enquiry";
