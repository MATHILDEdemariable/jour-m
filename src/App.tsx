
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
import './i18n';
import Dashboard from "./pages/Dashboard";
import PublicAccessPage from "./pages/PublicAccessPage";
import GuestDashboard from "./pages/GuestDashboard";
import MagicAccess from "./pages/MagicAccess";
import LandingPage from "./pages/LandingPage";

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
                <Route path="/" element={<LandingPage />} />
                <Route path="/auth" element={<AuthPage />} />
                <Route path="/event-portal" element={<EventPortal />} />
                {/* --- Route test simple --- */}
                <Route path="/test-simple" element={<div className="p-8 text-center"><h1 className="text-2xl font-bold text-green-600">✅ Test route OK</h1></div>} />
                {/* --- Routes publiques (AVANT les routes protégées) --- */}
                <Route path="/public-access" element={<PublicAccessPage />} />
                <Route path="/guest-dashboard" element={<GuestDashboard />} />
                <Route path="/magic-access" element={<MagicAccess />} />
                {/* --- Routes protégées --- */}
                <Route element={<ProtectedRoute />}>
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/event" element={<Index />} />
                  <Route path="/admin" element={<AdminPortal />} />
                  <Route path="/home" element={<Home />} />
                </Route>
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
