
import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/contexts/AuthContext';
import { LocalEventDataProvider } from '@/contexts/LocalEventDataContext';
import { LocalCurrentEventProvider } from '@/contexts/LocalCurrentEventContext';
import { OfflineManager } from '@/components/OfflineManager';
import { ProtectedRoute } from '@/components/ProtectedRoute';

// Pages
import Index from '@/pages/Index';
import Auth from '@/pages/Auth';
import UnifiedPortal from '@/pages/UnifiedPortal';
import EquipePage from '@/pages/EquipePage';
import PublicEventPage from '@/pages/PublicEventPage';

const queryClient = new QueryClient();

function App() {
  useEffect(() => {
    // Auto-detect system theme
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      document.documentElement.classList.add('dark');
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <LocalCurrentEventProvider>
          <LocalEventDataProvider>
            <Router>
              <div className="min-h-screen bg-background">
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/auth" element={<Auth />} />
                  <Route path="/portal" element={
                    <ProtectedRoute>
                      <UnifiedPortal />
                    </ProtectedRoute>
                  } />
                  <Route path="/dashboard" element={<Navigate to="/portal" replace />} />
                  <Route path="/equipe" element={<EquipePage />} />
                  <Route path="/share/:token" element={<PublicEventPage />} />
                  
                  {/* Redirect old routes to new unified portal */}
                  <Route path="/admin-portal" element={<Navigate to="/portal" replace />} />
                  <Route path="/event-portal" element={<Navigate to="/portal" replace />} />
                  <Route path="/public-portal" element={<Navigate to="/portal" replace />} />
                </Routes>
                <OfflineManager />
                <Toaster />
              </div>
            </Router>
          </LocalEventDataProvider>
        </LocalCurrentEventProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
