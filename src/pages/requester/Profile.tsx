import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { RequesterShell } from "@/components/requester/RequesterShell";
import { requesterProfile, entitlement } from "@/data/requester";
import { EntitlementWidget } from "@/components/requester/EntitlementWidget";

export default function RequesterProfile() {
  return (
    <RequesterShell>
      <div>
        <h1 className="font-display text-3xl font-semibold tracking-tight">Profile</h1>
        <p className="mt-1 text-sm text-muted-foreground">Your account details and notification preferences.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-3xl border border-border/60 bg-card/90 p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarFallback className="bg-gradient-primary text-base font-semibold text-primary-foreground">
                {requesterProfile.initials}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-lg font-semibold">{requesterProfile.name}</p>
              <p className="text-sm text-muted-foreground">{requesterProfile.team} · {requesterProfile.role}</p>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Full name" value={requesterProfile.name} />
            <Field label="Email" value={requesterProfile.email} />
            <Field label="Team" value={requesterProfile.team} />
            <Field label="Role" value={requesterProfile.role} />
          </div>

          <div className="mt-8">
            <h3 className="text-sm font-semibold">Notification preferences</h3>
            <div className="mt-3 space-y-2 rounded-2xl border border-border/60 bg-secondary/40 p-4">
              <PrefRow label="Booking confirmations" defaultOn />
              <PrefRow label="Waitlist promotions" defaultOn />
              <PrefRow label="Enquiry status updates" defaultOn />
              <PrefRow label="Weekly summary email" />
            </div>
          </div>

          <div className="mt-6 flex gap-2">
            <Button className="rounded-full">Save changes</Button>
            <Button variant="outline" className="rounded-full">Cancel</Button>
          </div>
        </div>

        <EntitlementWidget data={entitlement} />
      </div>
    </RequesterShell>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <Label className="text-[11px] uppercase tracking-wide text-muted-foreground">{label}</Label>
      <Input defaultValue={value} className="mt-1.5 rounded-xl border-border/60 bg-card" />
    </div>
  );
}

function PrefRow({ label, defaultOn }: { label: string; defaultOn?: boolean }) {
  return (
    <div className="flex items-center justify-between rounded-xl bg-card px-3 py-2.5">
      <span className="text-sm">{label}</span>
      <Switch defaultChecked={defaultOn} />
    </div>
  );
}
