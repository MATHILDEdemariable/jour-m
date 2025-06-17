
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LocalCurrentEventProvider } from "@/contexts/LocalCurrentEventContext";
import { LocalEventDataProvider } from "@/contexts/LocalEventDataContext";
import SimpleDashboard from "./pages/SimpleDashboard";
import AdminPortal from "./pages/AdminPortal";
import EventPortal from "./pages/EventPortal";
import NotFound from "./pages/NotFound";
import TeamDashboard from "./pages/TeamDashboard";
import './i18n';

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <LocalCurrentEventProvider>
        <LocalEventDataProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <Routes>
              <Route path="/" element={<SimpleDashboard />} />
              <Route path="/admin" element={<AdminPortal />} />
              <Route path="/event-portal" element={<EventPortal />} />
              <Route path="/team-dashboard" element={<TeamDashboard />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </TooltipProvider>
        </LocalEventDataProvider>
      </LocalCurrentEventProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
