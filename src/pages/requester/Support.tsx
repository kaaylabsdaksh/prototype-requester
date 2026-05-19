import { LifeBuoy, Mail, MessageCircle, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RequesterShell } from "@/components/requester/RequesterShell";
import { toast } from "sonner";

export default function RequesterSupport() {
  return (
    <RequesterShell>
      <div>
        <h1 className="font-display text-3xl font-semibold tracking-tight">Support</h1>
        <p className="mt-1 text-sm text-muted-foreground">Get help with bookings, enquiries or your account.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Channel icon={<Mail className="h-5 w-5" />} title="Email" body="support@aok.events" sub="Reply within 4 hours" />
        <Channel icon={<MessageCircle className="h-5 w-5" />} title="Live chat" body="Mon–Fri · 9am–6pm" sub="Average wait: 2 min" />
        <Channel icon={<BookOpen className="h-5 w-5" />} title="Help centre" body="docs.aok.events" sub="Guides & FAQs" />
      </div>

      <form
        onSubmit={(e) => { e.preventDefault(); toast.success("Support request submitted"); }}
        className="rounded-3xl border border-border/60 bg-card/90 p-6 shadow-sm"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent text-accent-foreground">
            <LifeBuoy className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-base font-semibold">Open a support ticket</h2>
            <p className="text-xs text-muted-foreground">We'll get back to you on your registered email.</p>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <Label className="text-[11px] uppercase tracking-wide text-muted-foreground">Subject</Label>
            <Input required placeholder="Brief summary" className="mt-1.5 rounded-xl border-border/60 bg-card" />
          </div>
          <div>
            <Label className="text-[11px] uppercase tracking-wide text-muted-foreground">Related booking (optional)</Label>
            <Input placeholder="BKG-XXXX" className="mt-1.5 rounded-xl border-border/60 bg-card" />
          </div>
        </div>
        <div className="mt-4">
          <Label className="text-[11px] uppercase tracking-wide text-muted-foreground">Message</Label>
          <Textarea required rows={5} placeholder="Describe your issue…" className="mt-1.5 rounded-xl border-border/60 bg-card" />
        </div>
        <div className="mt-5 flex justify-end gap-2">
          <Button type="button" variant="outline" className="rounded-full">Cancel</Button>
          <Button type="submit" className="rounded-full">Submit request</Button>
        </div>
      </form>
    </RequesterShell>
  );
}

function Channel({ icon, title, body, sub }: { icon: React.ReactNode; title: string; body: string; sub: string }) {
  return (
    <div className="rounded-3xl border border-border/60 bg-card/90 p-5 shadow-sm">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent text-accent-foreground">
        {icon}
      </div>
      <p className="mt-3 text-sm font-semibold">{title}</p>
      <p className="mt-0.5 text-sm text-foreground">{body}</p>
      <p className="text-[11px] text-muted-foreground">{sub}</p>
    </div>
  );
}
