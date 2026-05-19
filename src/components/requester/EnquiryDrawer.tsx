import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { RequesterEnquiry, REQ_ENQUIRY_STATUS_LABEL, RequesterEnquiryStatus } from "@/data/requester";
import { EnquiryStatusChip } from "./StatusChip";
import { CalendarDays, MapPin, Users, Tag, CheckCircle2 } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

const ORDER: RequesterEnquiryStatus[] = ["submitted", "in_progress", "proposal_received", "accepted"];

interface Props {
  enquiry: RequesterEnquiry | null;
  open: boolean;
  onOpenChange: (v: boolean) => void;
}

export function EnquiryDrawer({ enquiry, open, onOpenChange }: Props) {
  if (!enquiry) return null;
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full overflow-y-auto sm:max-w-xl">
        <SheetHeader>
          <SheetDescription className="text-xs uppercase tracking-wide">{enquiry.ref}</SheetDescription>
          <SheetTitle className="flex flex-wrap items-center gap-3 text-2xl leading-tight">
            {enquiry.eventType}
            <EnquiryStatusChip s={enquiry.status} />
          </SheetTitle>
        </SheetHeader>

        <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
          <Field icon={<CalendarDays className="h-4 w-4" />} label="Submitted" value={format(new Date(enquiry.submittedAt), "PP")} />
          <Field icon={<CalendarDays className="h-4 w-4" />} label="Preferred date" value={format(new Date(enquiry.preferredDate), "PP")} />
          <Field icon={<Users className="h-4 w-4" />} label="Guests" value={String(enquiry.guests)} />
          <Field icon={<MapPin className="h-4 w-4" />} label="Location" value={enquiry.location} />
        </div>

        <div className="mt-4 rounded-xl border border-black/5 bg-[hsl(220_20%_98%)] p-3 text-sm text-foreground/80">
          {enquiry.notes}
        </div>

        <div className="mt-6">
          <h4 className="text-sm font-semibold">Status timeline</h4>
          <div className="mt-3 flex items-center gap-2">
            {ORDER.map((s, i) => {
              const idx = ORDER.indexOf(enquiry.status);
              const reached = idx >= i && enquiry.status !== "declined" && enquiry.status !== "cancelled";
              const isCurrent = enquiry.status === s;
              return (
                <div key={s} className="flex flex-1 items-center gap-2">
                  <div className={cn(
                    "flex h-7 w-7 items-center justify-center rounded-full text-[10px] font-semibold",
                    reached ? "bg-success text-success-foreground" : "bg-black/5 text-foreground/40",
                    isCurrent && "ring-2 ring-success ring-offset-2",
                  )}>
                    {reached ? <CheckCircle2 className="h-3.5 w-3.5" /> : i + 1}
                  </div>
                  {i < ORDER.length - 1 && (
                    <div className={cn("h-0.5 flex-1 rounded", reached ? "bg-success" : "bg-black/5")} />
                  )}
                </div>
              );
            })}
          </div>
          <div className="mt-2 flex justify-between text-[10px] text-foreground/50">
            {ORDER.map((s) => <span key={s} className="flex-1">{REQ_ENQUIRY_STATUS_LABEL[s]}</span>)}
          </div>
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
