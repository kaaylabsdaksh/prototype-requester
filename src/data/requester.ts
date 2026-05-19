export type BookingStatus =
  | "confirmed"
  | "pending_approval"
  | "waitlisted"
  | "cancelled"
  | "in_negotiation";

export const BOOKING_STATUS_LABEL: Record<BookingStatus, string> = {
  confirmed: "Confirmed",
  pending_approval: "Pending Approval",
  waitlisted: "Waitlisted",
  cancelled: "Cancelled",
  in_negotiation: "In Negotiation",
};

export interface RsvpSummary {
  accepted: number;
  declined: number;
  pending: number;
}

export interface Guest {
  id: string;
  name: string;
  email: string;
  rsvp: "accepted" | "declined" | "pending";
}

export interface BookingActivity {
  at: string;
  text: string;
}

export interface RequesterBooking {
  id: string;
  ref: string;
  eventName: string;
  date: string; // ISO
  venue: string;
  guestCount: number;
  rsvp: RsvpSummary;
  status: BookingStatus;
  type: "Conference" | "Workshop" | "Networking" | "Webinar" | "Gala";
  past?: boolean;
  guests: Guest[];
  activity: BookingActivity[];
  notes?: string;
}

export type RequesterEnquiryStatus =
  | "submitted"
  | "in_progress"
  | "proposal_received"
  | "accepted"
  | "declined"
  | "cancelled";

export const REQ_ENQUIRY_STATUS_LABEL: Record<RequesterEnquiryStatus, string> = {
  submitted: "Submitted",
  in_progress: "In Progress",
  proposal_received: "Proposal Received",
  accepted: "Accepted",
  declined: "Declined",
  cancelled: "Cancelled",
};

export interface RequesterEnquiry {
  id: string;
  ref: string;
  eventType: "Conference" | "Workshop" | "Networking" | "Webinar" | "Gala";
  submittedAt: string;
  status: RequesterEnquiryStatus;
  guests: number;
  preferredDate: string;
  location: string;
  notes: string;
}

export interface WishlistItem {
  id: string;
  event: string;
  venue: string;
  date: string;
  category: string;
}

export interface WaitlistEntry {
  id: string;
  event: string;
  venue: string;
  date: string;
  position: number;
  total: number;
  status: "active" | "promoted" | "expired";
}

export interface Entitlement {
  total: number;
  used: number;
  byCategory: { label: string; used: number; total: number; tone: "primary" | "info" | "success" | "warning" }[];
}

const today = new Date();
const d = (offset: number, hour = 18) => {
  const dt = new Date(today);
  dt.setDate(dt.getDate() + offset);
  dt.setHours(hour, 0, 0, 0);
  return dt.toISOString();
};

const mkGuests = (n: number, seed: string): Guest[] => {
  const names = [
    "Alex Morgan", "Priya Shah", "Marcus Chen", "Lina Park", "Tom Beckett",
    "Amelia Hart", "Ravi Desai", "Sophie Klein", "James Wu", "Noor Khan",
    "Eva Lindqvist", "Diego Ramos", "Hana Ito", "Olivia Reed", "Karim Bouzid",
  ];
  return Array.from({ length: n }).map((_, i) => {
    const name = names[(i + seed.length) % names.length];
    const r = (i + seed.length) % 3;
    return {
      id: `${seed}-g${i}`,
      name,
      email: name.toLowerCase().replace(" ", ".") + "@acme.com",
      rsvp: r === 0 ? "accepted" : r === 1 ? "pending" : "declined",
    };
  });
};

export const requesterBookings: RequesterBooking[] = [
  {
    id: "b1",
    ref: "BKG-2041",
    eventName: "Quarterly Leadership Forum",
    date: d(4, 9),
    venue: "Aurora Hall, London",
    guestCount: 8,
    rsvp: { accepted: 5, declined: 1, pending: 2 },
    status: "confirmed",
    type: "Conference",
    guests: mkGuests(8, "b1"),
    activity: [
      { at: d(-10, 9), text: "Booking confirmed by AOK London" },
      { at: d(-9, 11), text: "8 guests added" },
      { at: d(-2, 14), text: "RSVP reminders sent" },
    ],
    notes: "Front-row seating reserved for executive team.",
  },
  {
    id: "b2",
    ref: "BKG-2042",
    eventName: "AI in Finance Summit",
    date: d(9, 10),
    venue: "Skyline Center, NYC",
    guestCount: 4,
    rsvp: { accepted: 2, declined: 0, pending: 2 },
    status: "pending_approval",
    type: "Conference",
    guests: mkGuests(4, "b2"),
    activity: [
      { at: d(-3, 9), text: "Booking submitted, awaiting CEM approval" },
    ],
  },
  {
    id: "b3",
    ref: "BKG-2043",
    eventName: "Founders Networking Night",
    date: d(11, 19),
    venue: "Rooftop 22, Lisbon",
    guestCount: 3,
    rsvp: { accepted: 3, declined: 0, pending: 0 },
    status: "confirmed",
    type: "Networking",
    guests: mkGuests(3, "b3"),
    activity: [
      { at: d(-5, 11), text: "Booking confirmed" },
      { at: d(-1, 16), text: "All guests RSVP'd" },
    ],
  },
  {
    id: "b4",
    ref: "BKG-2044",
    eventName: "Sustainability Roundtable",
    date: d(5, 13),
    venue: "Greenhouse, Amsterdam",
    guestCount: 2,
    rsvp: { accepted: 0, declined: 0, pending: 2 },
    status: "waitlisted",
    type: "Networking",
    guests: mkGuests(2, "b4"),
    activity: [
      { at: d(-2, 14), text: "Added to waitlist (position 4)" },
    ],
  },
  {
    id: "b5",
    ref: "BKG-2045",
    eventName: "Annual Investor Gala",
    date: d(20, 19),
    venue: "The Pierre, NYC",
    guestCount: 6,
    rsvp: { accepted: 4, declined: 0, pending: 2 },
    status: "in_negotiation",
    type: "Gala",
    guests: mkGuests(6, "b5"),
    activity: [
      { at: d(-7, 9), text: "Negotiating table placement" },
    ],
  },
  {
    id: "b6",
    ref: "BKG-2046",
    eventName: "Design Systems Day",
    date: d(8, 10),
    venue: "Factory, Berlin",
    guestCount: 2,
    rsvp: { accepted: 2, declined: 0, pending: 0 },
    status: "confirmed",
    type: "Conference",
    guests: mkGuests(2, "b6"),
    activity: [{ at: d(-4, 10), text: "Booking confirmed" }],
  },
  // Past
  {
    id: "b7",
    ref: "BKG-2030",
    eventName: "Retail Innovation Day",
    date: d(-12, 11),
    venue: "Westfield, London",
    guestCount: 5,
    rsvp: { accepted: 4, declined: 1, pending: 0 },
    status: "confirmed",
    type: "Conference",
    past: true,
    guests: mkGuests(5, "b7"),
    activity: [{ at: d(-20, 9), text: "Booking confirmed" }, { at: d(-12, 18), text: "Event completed" }],
  },
  {
    id: "b8",
    ref: "BKG-2028",
    eventName: "Black Tie Charity Gala",
    date: d(-18, 19),
    venue: "Claridge's, London",
    guestCount: 4,
    rsvp: { accepted: 4, declined: 0, pending: 0 },
    status: "confirmed",
    type: "Gala",
    past: true,
    guests: mkGuests(4, "b8"),
    activity: [{ at: d(-25, 10), text: "Booking confirmed" }],
  },
  {
    id: "b9",
    ref: "BKG-2025",
    eventName: "Q1 Roadshow",
    date: d(-30, 9),
    venue: "Online",
    guestCount: 1,
    rsvp: { accepted: 0, declined: 0, pending: 0 },
    status: "cancelled",
    type: "Webinar",
    past: true,
    guests: [],
    activity: [{ at: d(-32, 9), text: "Booking cancelled by requester" }],
  },
];

export const requesterEnquiries: RequesterEnquiry[] = [
  { id: "qr1", ref: "ENQ-1051", eventType: "Conference", submittedAt: d(-1, 10), status: "submitted", guests: 120, preferredDate: d(40, 9), location: "London", notes: "Annual partner summit." },
  { id: "qr2", ref: "ENQ-1048", eventType: "Workshop", submittedAt: d(-5, 14), status: "in_progress", guests: 25, preferredDate: d(28, 14), location: "Berlin", notes: "Design thinking session." },
  { id: "qr3", ref: "ENQ-1042", eventType: "Gala", submittedAt: d(-12, 11), status: "proposal_received", guests: 80, preferredDate: d(55, 19), location: "Paris", notes: "Black tie awards dinner." },
  { id: "qr4", ref: "ENQ-1037", eventType: "Networking", submittedAt: d(-22, 9), status: "accepted", guests: 40, preferredDate: d(15, 18), location: "Lisbon", notes: "Founders mixer." },
  { id: "qr5", ref: "ENQ-1029", eventType: "Webinar", submittedAt: d(-40, 9), status: "declined", guests: 300, preferredDate: d(10, 16), location: "Online", notes: "Product launch." },
];

export const requesterWishlist: WishlistItem[] = [
  { id: "w1", event: "Cloud Architects Summit", venue: "Moscone West, SF", date: d(18, 9), category: "Conference" },
  { id: "w2", event: "Women in Tech Gala", venue: "The Savoy, London", date: d(25, 19), category: "Gala" },
  { id: "w3", event: "GenAI Product Workshop", venue: "Station F, Paris", date: d(10, 13), category: "Workshop" },
  { id: "w4", event: "APAC Customer Summit", venue: "Marina Bay Sands", date: d(60, 9), category: "Conference" },
];

export const requesterWaitlist: WaitlistEntry[] = [
  { id: "wl1", event: "AI in Finance Summit", venue: "Skyline Center, NYC", date: d(9, 10), position: 4, total: 87, status: "active" },
  { id: "wl2", event: "Sustainability Roundtable", venue: "Greenhouse, Amsterdam", date: d(5, 13), position: 2, total: 16, status: "active" },
  { id: "wl3", event: "DevRel Leaders Dinner", venue: "Hawksmoor, London", date: d(12, 19), position: 1, total: 7, status: "promoted" },
];

export const entitlement: Entitlement = {
  total: 24,
  used: 14,
  byCategory: [
    { label: "Conferences", used: 6, total: 10, tone: "primary" },
    { label: "Workshops", used: 3, total: 6, tone: "info" },
    { label: "Galas", used: 2, total: 4, tone: "warning" },
    { label: "Networking", used: 3, total: 4, tone: "success" },
  ],
};

export const requesterProfile = {
  name: "Sofia Marin",
  email: "sofia.marin@acme.com",
  role: "Requester",
  team: "Strategic Partnerships",
  initials: "SM",
};
