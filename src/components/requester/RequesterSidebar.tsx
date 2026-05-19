import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { LayoutDashboard, CalendarCheck, Inbox, Heart, User, LifeBuoy, LogOut, ChevronsLeft, ChevronsRight, Compass } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import logo from "@/assets/aok-logo.png";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

const items = [
  { title: "Dashboard", url: "/requester", icon: LayoutDashboard, exact: true },
  { title: "Browse Events", url: "/requester/browse", icon: Compass },
  { title: "My Bookings", url: "/requester/bookings", icon: CalendarCheck },
  { title: "Enquiries", url: "/requester/enquiries", icon: Inbox },
  { title: "Wishlist", url: "/requester/wishlist", icon: Heart },
  { title: "Profile", url: "/requester/profile", icon: User },
  { title: "Support", url: "/requester/support", icon: LifeBuoy },
];

export function RequesterSidebar() {
  const { state, toggleSidebar } = useSidebar();
  const collapsed = state === "collapsed";
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const isActive = (path: string, exact?: boolean) =>
    exact ? pathname === path : pathname === path || pathname.startsWith(path + "/");

  const handleSignOut = async () => {
    await signOut();
    toast.success("Signed out");
    navigate("/auth", { replace: true });
  };

  return (
    <Sidebar collapsible="icon" variant="floating">
      <SidebarHeader className="px-3 py-4">
        <div className={`flex items-center ${collapsed ? "justify-center" : "justify-between gap-2.5"}`}>
          <div className={`flex items-center gap-2.5 ${collapsed ? "justify-center" : ""}`}>
            <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full shadow-elegant">
              <img src={logo} alt="AOK Events" className="h-full w-full object-cover" />
            </div>
            {!collapsed && (
              <div className="flex flex-col leading-tight">
                <span className="text-sm font-semibold text-sidebar-foreground">AOK Events</span>
                <span className="text-[11px] text-sidebar-foreground/75">Requester Portal</span>
              </div>
            )}
          </div>
          {!collapsed && (
            <button
              onClick={toggleSidebar}
              aria-label="Collapse sidebar"
              className="flex h-7 w-7 items-center justify-center rounded-md text-sidebar-foreground/70 transition-colors hover:bg-sidebar-accent hover:text-sidebar-foreground"
            >
              <ChevronsLeft className="h-4 w-4" />
            </button>
          )}
        </div>
        {collapsed && (
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={toggleSidebar}
                aria-label="Expand sidebar"
                className="mt-2 flex h-7 w-full items-center justify-center rounded-md text-sidebar-foreground/70 transition-colors hover:bg-sidebar-accent hover:text-sidebar-foreground"
              >
                <ChevronsRight className="h-4 w-4" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="right" sideOffset={8}>Expand</TooltipContent>
          </Tooltip>
        )}
      </SidebarHeader>
      <SidebarContent className="px-2">
        <SidebarGroup>
          <SidebarGroupLabel>Workspace</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
                const active = isActive(item.url, item.exact);
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={active} tooltip={item.title}>
                      <NavLink to={item.url} className={`flex items-center gap-3 rounded-lg ${collapsed ? "justify-center" : ""}`}>
                        <item.icon className="h-4 w-4" />
                        {!collapsed && <span className="text-sm font-medium">{item.title}</span>}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={handleSignOut} tooltip="Log out">
              <LogOut className="h-4 w-4" />
              {!collapsed && <span className="text-sm font-medium">Log out</span>}
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
