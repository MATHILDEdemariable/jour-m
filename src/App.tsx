import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { CurrentEventProvider } from "@/contexts/CurrentEventContext";
import { EventDataProvider } from "@/contexts/EventDataContext";
import Home from "./pages/Home";
import Index from "./pages/Index";
import AdminPortal from "./pages/AdminPortal";
import EventPortal from "./pages/EventPortal";
import NotFound from "./pages/NotFound";
import AuthPage from "./pages/Auth";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import './i18n'; // Import du système i18n
import Dashboard from "./pages/Dashboard";
import PublicAccessPage from "./pages/PublicAccessPage"; // Correction: import direct
import GuestDashboard from "./pages/GuestDashboard";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <AuthProvider>
        <CurrentEventProvider>
          <EventDataProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/auth" element={<AuthPage />} />
                <Route path="/event-portal" element={<EventPortal />} />
                {/* --- Ajout route publique minimaliste --- */}
                <Route path="/public-access" element={<PublicAccessPage />} />
                <Route path="/guest-dashboard" element={<GuestDashboard />} />
                <Route element={<ProtectedRoute />}>
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/event" element={<Index />} />
                  <Route path="/admin" element={<AdminPortal />} />
                </Route>
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </TooltipProvider>
          </EventDataProvider>
        </CurrentEventProvider>
      </AuthProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
