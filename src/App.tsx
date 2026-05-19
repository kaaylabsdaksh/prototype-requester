import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";

import NotFound from "./pages/NotFound.tsx";
import AuthPage from "./pages/Auth.tsx";
import RequesterDashboard from "./pages/requester/Dashboard.tsx";
import RequesterBrowse from "./pages/requester/Browse.tsx";
import RequesterBookings from "./pages/requester/Bookings.tsx";
import RequesterEnquiries from "./pages/requester/Enquiries.tsx";
import RequesterWishlist from "./pages/requester/Wishlist.tsx";
import RequesterProfile from "./pages/requester/Profile.tsx";
import RequesterSupport from "./pages/requester/Support.tsx";

const queryClient = new QueryClient();

const protect = (el: JSX.Element) => <ProtectedRoute>{el}</ProtectedRoute>;

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/" element={protect(<RequesterDashboard />)} />
            <Route path="/requester" element={protect(<RequesterDashboard />)} />
            <Route path="/requester/browse" element={protect(<RequesterBrowse />)} />
            <Route path="/requester/bookings" element={protect(<RequesterBookings />)} />
            <Route path="/requester/enquiries" element={protect(<RequesterEnquiries />)} />
            <Route path="/requester/wishlist" element={protect(<RequesterWishlist />)} />
            <Route path="/requester/profile" element={protect(<RequesterProfile />)} />
            <Route path="/requester/support" element={protect(<RequesterSupport />)} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
