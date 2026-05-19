import { useEffect, useMemo, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { discoverEvents, ENQUIRY_OPEN_EVENT } from "@/data/requesterDiscover";
import { CalendarIcon, Check, ChevronRight, Sparkles, MapPin, CalendarDays, ChevronLeft } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { EventStatusChip } from "./EventStatusChip";

const TYPES = ["Conference", "Workshop", "Networking", "Webinar", "Gala"] as const;
const BUDGETS = ["< $5k", "$5k – $20k", "$20k – $50k", "$50k – $100k", "$100k+"] as const;
const LOCATIONS = ["London", "New York", "Berlin", "Paris", "Lisbon", "Amsterdam", "Online", "Other"] as const;
const GUEST_RANGES = ["1–10", "11–25", "26–50", "51–100", "101–250", "250+"] as const;

type EventType = typeof TYPES[number];

interface Form {
  type: EventType | null;
  date: Date | undefined;
  guests: string | null;
  budget: string | null;
  location: string | null;
  notes: string;
}

const STEPS = ["Event type", "Date", "Guests", "Budget", "Location", "Details", "Review"] as const;

export function SubmitEnquiryDialog() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState<string | null>(null);
  const [form, setForm] = useState<Form>({
    type: null, date: undefined, guests: null, budget: null, location: null, notes: "",
  });

  useEffect(() => {
    const handler = () => { setOpen(true); setStep(0); setSubmitted(null); };
    window.addEventListener(ENQUIRY_OPEN_EVENT, handler);
    return () => window.removeEventListener(ENQUIRY_OPEN_EVENT, handler);
  }, []);

  useEffect(() => {
    if (!open) {
      setTimeout(() => {
        setForm({ type: null, date: undefined, guests: null, budget: null, location: null, notes: "" });
        setStep(0); setSubmitted(null);
      }, 200);
    }
  }, [open]);

  const suggestions = useMemo(() => {
    if (!form.type) return [];
    return discoverEvents
      .filter((e) => e.type === form.type && e.discoverStatus !== "closed" && e.discoverStatus !== "waitlisted")
      .slice(0, 3);
  }, [form.type]);

  const canNext = () => {
    switch (step) {
      case 0: return !!form.type;
      case 1: return !!form.date;
      case 2: return !!form.guests;
      case 3: return !!form.budget;
      case 4: return !!form.location;
      default: return true;
    }
  };

  const submit = () => {
    const ref = `ENQ-${1100 + Math.floor(Math.random() * 800)}`;
    setSubmitted(ref);
    toast.success(`Enquiry ${ref} submitted`);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-xl overflow-hidden p-0">
        {submitted ? (
          <ConfirmationView reference={submitted} onClose={() => setOpen(false)} />
        ) : (
          <>
            <DialogHeader className="border-b border-border/60 bg-gradient-hero/30 px-6 pb-4 pt-6">
              <DialogDescription className="text-[11px] uppercase tracking-wide">
                Step {step + 1} of {STEPS.length}
              </DialogDescription>
              <DialogTitle className="font-display text-xl">{STEPS[step]}</DialogTitle>
              <Progress step={step} total={STEPS.length} />
            </DialogHeader>

            <div className="max-h-[60vh] overflow-y-auto px-6 py-5">
              {step === 0 && (
                <ChipGroup
                  options={TYPES as readonly string[]}
                  value={form.type}
                  onChange={(v) => setForm({ ...form, type: v as EventType })}
                  label="What kind of event are you planning?"
                />
              )}
              {step === 1 && (
                <div>
                  <p className="mb-3 text-sm text-muted-foreground">Pick a preferred date.</p>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className={cn("w-full justify-start rounded-full", !form.date && "text-muted-foreground")}>
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {form.date ? format(form.date, "PPP") : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={form.date}
                        onSelect={(d) => setForm({ ...form, date: d })}
                        disabled={(d) => d < new Date()}
                        initialFocus
                        className={cn("p-3 pointer-events-auto")}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              )}
              {step === 2 && (
                <ChipGroup
                  options={GUEST_RANGES as readonly string[]}
                  value={form.guests}
                  onChange={(v) => setForm({ ...form, guests: v })}
                  label="Expected number of guests?"
                />
              )}
              {step === 3 && (
                <ChipGroup
                  options={BUDGETS as readonly string[]}
                  value={form.budget}
                  onChange={(v) => setForm({ ...form, budget: v })}
                  label="What's your budget range?"
                />
              )}
              {step === 4 && (
                <ChipGroup
                  options={LOCATIONS as readonly string[]}
                  value={form.location}
                  onChange={(v) => setForm({ ...form, location: v })}
                  label="Preferred location?"
                />
              )}
              {step === 5 && (
                <div>
                  <p className="mb-2 text-sm text-muted-foreground">Anything else we should know?</p>
                  <Textarea
                    rows={5}
                    placeholder="Format, accessibility, audience profile, must-haves…"
                    value={form.notes}
                    onChange={(e) => setForm({ ...form, notes: e.target.value })}
                    className="rounded-2xl"
                  />
                  {suggestions.length > 0 && (
                    <div className="mt-5 rounded-2xl border border-primary/20 bg-primary/5 p-4">
                      <div className="mb-2 flex items-center gap-2 text-sm font-semibold">
                        <Sparkles className="h-4 w-4 text-primary" />
                        You may already have suitable events available
                      </div>
                      <p className="mb-3 text-xs text-muted-foreground">
                        Based on your criteria, these existing {form.type} events may match.
                      </p>
                      <div className="space-y-2">
                        {suggestions.map((s) => (
                          <div key={s.id} className="flex items-center gap-3 rounded-xl border border-border/60 bg-card p-3">
                            <div className="min-w-0 flex-1">
                              <p className="truncate text-sm font-semibold">{s.name}</p>
                              <p className="mt-0.5 truncate text-[11px] text-muted-foreground">
                                <MapPin className="mr-1 inline h-3 w-3" />{s.venue}
                                <span className="mx-1.5">·</span>
                                <CalendarDays className="mr-1 inline h-3 w-3" />{format(new Date(s.date), "d MMM")}
                              </p>
                            </div>
                            <EventStatusChip s={s.discoverStatus} />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
              {step === 6 && (
                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground">Review your enquiry before submitting.</p>
                  <ReviewRow label="Event type" value={form.type ?? "—"} />
                  <ReviewRow label="Preferred date" value={form.date ? format(form.date, "PPP") : "—"} />
                  <ReviewRow label="Guests" value={form.guests ?? "—"} />
                  <ReviewRow label="Budget" value={form.budget ?? "—"} />
                  <ReviewRow label="Location" value={form.location ?? "—"} />
                  {form.notes && <ReviewRow label="Notes" value={form.notes} />}
                </div>
              )}
            </div>

            <div className="flex items-center justify-between border-t border-border/60 bg-card/60 px-6 py-3">
              <Button
                variant="ghost"
                size="sm"
                className="rounded-full"
                onClick={() => setStep((s) => Math.max(0, s - 1))}
                disabled={step === 0}
              >
                <ChevronLeft className="mr-1 h-4 w-4" /> Back
              </Button>
              {step < STEPS.length - 1 ? (
                <Button size="sm" className="rounded-full" disabled={!canNext()} onClick={() => setStep((s) => s + 1)}>
                  Next <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              ) : (
                <Button size="sm" className="rounded-full" onClick={submit}>
                  Submit enquiry
                </Button>
              )}
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

function Progress({ step, total }: { step: number; total: number }) {
  return (
    <div className="mt-3 flex items-center gap-1">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className={cn(
            "h-1 flex-1 rounded-full transition-colors",
            i <= step ? "bg-primary" : "bg-muted",
          )}
        />
      ))}
    </div>
  );
}

function ChipGroup({ options, value, onChange, label }: { options: readonly string[]; value: string | null; onChange: (v: string) => void; label: string }) {
  return (
    <div>
      <p className="mb-3 text-sm text-muted-foreground">{label}</p>
      <div className="flex flex-wrap gap-2">
        {options.map((o) => {
          const active = value === o;
          return (
            <button
              key={o}
              onClick={() => onChange(o)}
              className={cn(
                "rounded-full border px-4 py-2 text-sm font-medium transition-all",
                active
                  ? "border-primary bg-primary text-primary-foreground shadow-sm"
                  : "border-border/60 bg-card hover:border-primary/40 hover:bg-accent/40",
              )}
            >
              {o}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function ReviewRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-3 rounded-xl border border-border/60 bg-card px-4 py-2.5">
      <span className="text-[11px] uppercase tracking-wide text-muted-foreground">{label}</span>
      <span className="text-right text-sm font-medium">{value}</span>
    </div>
  );
}

function ConfirmationView({ reference, onClose }: { reference: string; onClose: () => void }) {
  return (
    <div className="flex flex-col items-center px-8 py-12 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-success/15 text-success">
        <Check className="h-7 w-7" />
      </div>
      <h3 className="mt-4 font-display text-xl font-semibold">Enquiry submitted</h3>
      <p className="mt-1 text-sm text-muted-foreground">
        Your reference number is <span className="font-semibold text-foreground">{reference}</span>.
      </p>
      <p className="mt-1 max-w-sm text-xs text-muted-foreground">
        We've added it to your dashboard. The AOK team will review it shortly and you'll be notified of any updates.
      </p>
      <Button className="mt-6 rounded-full" onClick={onClose}>Done</Button>
    </div>
  );
}

export const openEnquiry = () => window.dispatchEvent(new CustomEvent(ENQUIRY_OPEN_EVENT));
