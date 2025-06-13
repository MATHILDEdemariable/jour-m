
import { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/contexts/AuthContext";
import { EventDataProvider } from "@/contexts/EventDataContext";
import { CurrentEventProvider } from "@/contexts/CurrentEventContext";
import "./App.css";

// Lazy load pages
const Index = lazy(() => import("./pages/Index"));
const Auth = lazy(() => import("./pages/Auth"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const CreateEvent = lazy(() => import("./pages/CreateEvent"));
const EventPortal = lazy(() => import("./pages/EventPortal"));
const AdminPortal = lazy(() => import("./pages/AdminPortal"));

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <div className="min-h-screen bg-background font-sans antialiased">
            <Suspense
              fallback={
                <div className="flex items-center justify-center min-h-screen">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              }
            >
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/create-event" element={<CreateEvent />} />
                <Route
                  path="/event/:eventId/*"
                  element={
                    <CurrentEventProvider>
                      <EventDataProvider>
                        <EventPortal />
                      </EventDataProvider>
                    </CurrentEventProvider>
                  }
                />
                <Route
                  path="/admin/:eventId/*"
                  element={
                    <CurrentEventProvider>
                      <EventDataProvider>
                        <AdminPortal />
                      </EventDataProvider>
                    </CurrentEventProvider>
                  }
                />
              </Routes>
            </Suspense>
            <Toaster />
          </div>
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
