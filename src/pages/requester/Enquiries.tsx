import { useMemo, useState } from "react";
import { format } from "date-fns";
import { Search, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RequesterShell } from "@/components/requester/RequesterShell";
import { requesterEnquiries, RequesterEnquiry, REQ_ENQUIRY_STATUS_LABEL } from "@/data/requester";
import { EnquiryStatusChip } from "@/components/requester/StatusChip";
import { EnquiryDrawer } from "@/components/requester/EnquiryDrawer";
import { cn } from "@/lib/utils";
import { openEnquiry } from "@/components/requester/SubmitEnquiryDialog";

export default function RequesterEnquiries() {
  const [query, setQuery] = useState("");
  const [statusF, setStatusF] = useState("all");
  const [selected, setSelected] = useState<RequesterEnquiry | null>(null);
  const [open, setOpen] = useState(false);

  const filtered = useMemo(() => {
    let list = requesterEnquiries;
    if (statusF !== "all") list = list.filter((e) => e.status === statusF);
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter((e) => e.ref.toLowerCase().includes(q) || e.eventType.toLowerCase().includes(q) || e.location.toLowerCase().includes(q));
    }
    return [...list].sort((a, b) => +new Date(b.submittedAt) - +new Date(a.submittedAt));
  }, [query, statusF]);

  return (
    <RequesterShell>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-semibold tracking-tight">Enquiries</h1>
          <p className="mt-1 text-sm text-muted-foreground">{filtered.length} enquiries · track requests and proposals.</p>
        </div>
        <Button className="rounded-full" onClick={openEnquiry}><Plus className="mr-1.5 h-4 w-4" /> New enquiry</Button>
      </div>

      <div className="rounded-2xl border border-border/60 bg-card/90 p-3 shadow-sm sm:p-4">
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative flex-1 sm:flex-none sm:w-64">
            <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search enquiries"
              className="h-9 rounded-full border-border/60 bg-secondary/60 pl-9 text-xs"
            />
          </div>
          <Select value={statusF} onValueChange={setStatusF}>
            <SelectTrigger className="h-9 w-44 rounded-full border-border/60 bg-card text-xs"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              {Object.entries(REQ_ENQUIRY_STATUS_LABEL).map(([k, v]) => (
                <SelectItem key={k} value={k}>{v}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((e) => (
            <button
              key={e.id}
              onClick={() => { setSelected(e); setOpen(true); }}
              className="group rounded-2xl border border-border/60 bg-card p-4 text-left transition-all hover:border-primary/30 hover:shadow-soft"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">{e.ref}</p>
                  <p className="mt-0.5 text-sm font-semibold">{e.eventType}</p>
                </div>
                <EnquiryStatusChip s={e.status} />
              </div>
              <p className="mt-2 line-clamp-2 text-xs text-muted-foreground">{e.notes}</p>
              <div className="mt-3 flex items-center justify-between text-[11px] text-muted-foreground">
                <span>{e.location} · {e.guests} guests</span>
                <span>Submitted {format(new Date(e.submittedAt), "d MMM")}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      <EnquiryDrawer enquiry={selected} open={open} onOpenChange={setOpen} />
    </RequesterShell>
  );
}
