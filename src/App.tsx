import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

import NotFound from "./pages/NotFound.tsx";
import RequesterDashboard from "./pages/requester/Dashboard.tsx";
import RequesterBrowse from "./pages/requester/Browse.tsx";
import RequesterBookings from "./pages/requester/Bookings.tsx";
import RequesterEnquiries from "./pages/requester/Enquiries.tsx";
import RequesterWishlist from "./pages/requester/Wishlist.tsx";
import RequesterProfile from "./pages/requester/Profile.tsx";
import RequesterSupport from "./pages/requester/Support.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<RequesterDashboard />} />
          <Route path="/requester" element={<RequesterDashboard />} />
          <Route path="/requester/browse" element={<RequesterBrowse />} />
          <Route path="/requester/bookings" element={<RequesterBookings />} />
          <Route path="/requester/enquiries" element={<RequesterEnquiries />} />
          <Route path="/requester/wishlist" element={<RequesterWishlist />} />
          <Route path="/requester/profile" element={<RequesterProfile />} />
          <Route path="/requester/support" element={<RequesterSupport />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
