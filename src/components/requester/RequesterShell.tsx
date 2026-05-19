import { ReactNode } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { RequesterSidebar } from "./RequesterSidebar";
import { RequesterTopBar } from "./RequesterTopBar";
import { SubmitEnquiryDialog } from "./SubmitEnquiryDialog";

export function RequesterShell({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-gradient-bg">
        <RequesterSidebar />
        <div className="min-w-0 flex-1 p-2 md:p-3">
          <div className="mx-auto flex min-w-0 max-w-[1500px] flex-col rounded-[2rem] border border-border/60 bg-card/70 shadow-panel backdrop-blur-xl">
            <RequesterTopBar />
            <main className="px-3 py-4 sm:px-4 sm:py-6 md:px-6">
              <div className="w-full space-y-6">{children}</div>
            </main>
          </div>
        </div>
        <SubmitEnquiryDialog />
      </div>
    </SidebarProvider>
  );
}
