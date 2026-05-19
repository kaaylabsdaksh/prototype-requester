import { useState } from "react";
import { Bell, Search, Plus, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { requesterProfile } from "@/data/requester";
import { cn } from "@/lib/utils";
import { openEnquiry } from "./SubmitEnquiryDialog";

const sampleNotifs = [
  { id: "rn1", title: "Booking confirmed", body: "BKG-2041 — Quarterly Leadership Forum", time: "2m ago", unread: true },
  { id: "rn2", title: "Waitlist promoted", body: "DevRel Leaders Dinner — you're in!", time: "1h ago", unread: true },
  { id: "rn3", title: "Proposal received", body: "ENQ-1042 — Black tie awards dinner", time: "Yesterday", unread: false },
];

export function RequesterTopBar() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [notifs, setNotifs] = useState(sampleNotifs);
  const unread = notifs.filter((n) => n.unread).length;
  const markAll = () => setNotifs((ns) => ns.map((n) => ({ ...n, unread: false })));

  return (
    <header className="sticky top-2 z-30 px-3 pt-3 md:px-4 md:pt-4">
      <div className="flex h-14 items-center gap-3 rounded-2xl border border-border/60 bg-card/95 px-4 shadow-panel backdrop-blur-xl supports-[backdrop-filter]:bg-card/80 md:px-5">
        <SidebarTrigger className="h-8 w-8 md:hidden" />
        <span className="hidden font-display text-sm font-semibold sm:inline">My Bookings</span>

        <div className="ml-auto flex items-center gap-1.5">
          {searchOpen ? (
            <div className="relative animate-fade-in">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                autoFocus
                onBlur={() => setSearchOpen(false)}
                placeholder="Search bookings…"
                className="h-9 w-36 rounded-full border-border/60 bg-secondary/60 pl-9 sm:w-44 md:w-56"
              />
            </div>
          ) : (
            <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full" onClick={() => setSearchOpen(true)}>
              <Search className="h-4 w-4" />
            </Button>
          )}

          <Button size="sm" className="hidden h-9 gap-1.5 rounded-full px-3 sm:inline-flex" onClick={openEnquiry}>
            <Plus className="h-4 w-4" />
            <span className="text-xs font-semibold">New Enquiry</span>
          </Button>

          <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full">
            <HelpCircle className="h-4 w-4" />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative h-9 w-9 rounded-full">
                <Bell className="h-4 w-4" />
                {unread > 0 && (
                  <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-bold text-destructive-foreground">
                    {unread}
                  </span>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80 p-0">
              <div className="flex items-center justify-between border-b border-border px-3 py-2.5">
                <p className="text-sm font-semibold">Notifications</p>
                <button onClick={markAll} className="text-xs text-primary hover:underline">Mark all read</button>
              </div>
              <div className="max-h-96 overflow-y-auto">
                {notifs.map((n) => (
                  <div
                    key={n.id}
                    className={cn(
                      "flex w-full gap-3 border-b border-border/60 px-3 py-3 text-left transition-colors hover:bg-secondary/60",
                      n.unread && "bg-accent/30"
                    )}
                  >
                    <span className={cn("mt-1 h-2 w-2 shrink-0 rounded-full", n.unread ? "bg-primary" : "bg-transparent")} />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium">{n.title}</p>
                      <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">{n.body}</p>
                      <p className="mt-1 text-[11px] text-muted-foreground">{n.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="ml-1 flex items-center gap-2 rounded-full bg-card/70 py-1 pl-1 pr-3 transition-colors hover:bg-secondary/60">
                <Avatar className="h-7 w-7">
                  <AvatarFallback className="bg-gradient-primary text-[11px] font-semibold text-primary-foreground">
                    {requesterProfile.initials}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden text-left leading-tight sm:block">
                  <p className="text-xs font-semibold">{requesterProfile.name}</p>
                  <p className="text-[10px] text-muted-foreground">{requesterProfile.role}</p>
                </div>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="flex flex-col">
                  <span className="text-sm font-semibold">{requesterProfile.name}</span>
                  <span className="text-xs font-normal text-muted-foreground">{requesterProfile.email}</span>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Notification settings</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive">Sign out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
