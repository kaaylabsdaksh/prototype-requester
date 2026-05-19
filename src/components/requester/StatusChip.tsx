import { cn } from "@/lib/utils";
import { BookingStatus, BOOKING_STATUS_LABEL, RequesterEnquiryStatus, REQ_ENQUIRY_STATUS_LABEL } from "@/data/requester";

const BOOKING_STATUS_CHIP: Record<BookingStatus, string> = {
  confirmed: "bg-[hsl(140_55%_92%)] text-[hsl(140_55%_30%)]",
  pending_approval: "bg-[hsl(45_95%_92%)] text-[hsl(35_85%_40%)]",
  waitlisted: "bg-[hsl(220_85%_94%)] text-[hsl(220_85%_45%)]",
  cancelled: "bg-[hsl(220_10%_94%)] text-[hsl(220_10%_45%)]",
  in_negotiation: "bg-[hsl(280_70%_94%)] text-[hsl(280_60%_45%)]",
};

const ENQUIRY_STATUS_CHIP: Record<RequesterEnquiryStatus, string> = {
  submitted: "bg-[hsl(220_10%_92%)] text-[hsl(220_10%_35%)]",
  in_progress: "bg-[hsl(220_85%_94%)] text-[hsl(220_85%_45%)]",
  proposal_received: "bg-[hsl(280_70%_94%)] text-[hsl(280_60%_45%)]",
  accepted: "bg-[hsl(140_55%_92%)] text-[hsl(140_55%_30%)]",
  declined: "bg-[hsl(0_75%_94%)] text-[hsl(0_75%_45%)]",
  cancelled: "bg-[hsl(220_10%_94%)] text-[hsl(220_10%_45%)]",
};

export function BookingStatusChip({ s }: { s: BookingStatus }) {
  return (
    <span className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold", BOOKING_STATUS_CHIP[s])}>
      {BOOKING_STATUS_LABEL[s]}
    </span>
  );
}

export function EnquiryStatusChip({ s }: { s: RequesterEnquiryStatus }) {
  return (
    <span className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold", ENQUIRY_STATUS_CHIP[s])}>
      {REQ_ENQUIRY_STATUS_LABEL[s]}
    </span>
  );
}
