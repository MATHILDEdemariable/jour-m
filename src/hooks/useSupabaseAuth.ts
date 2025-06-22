
import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';

export const useSupabaseAuth = () => {
  const { user, session, isLoading } = useAuth();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!isLoading) {
      const authenticated = !!(user && session);
      setIsAuthenticated(authenticated);
      
      console.log('useSupabaseAuth - Auth state updated:', { 
        authenticated, 
        currentPath: location.pathname,
        user: user?.id,
        session: !!session 
      });
      
      // Only handle redirections if we're not already on the target page
      if (authenticated && location.pathname === '/auth') {
        console.log('useSupabaseAuth - User authenticated on auth page, initiating redirection');
        
        // Small delay to ensure state is fully updated
        setTimeout(() => {
          // Check if user came from creation flow
          const createEventIntent = localStorage.getItem('create_event_intent');
          if (createEventIntent === 'true') {
            console.log('useSupabaseAuth - Creation intent detected, redirecting to portal with setup');
            navigate('/portal?setup=true&tab=config', { replace: true });
          } else {
            console.log('useSupabaseAuth - Regular auth, redirecting to portal');
            navigate('/portal', { replace: true });
          }
        }, 100);
        return;
      }
      
      // Redirect to auth if not authenticated and on a protected page
      const publicPaths = ['/auth', '/', '/equipe'];
      const isPublicPath = publicPaths.includes(location.pathname);
      
      if (!authenticated && !isPublicPath && !location.pathname.startsWith('/portal')) {
        console.log('useSupabaseAuth - User not authenticated on protected page, redirecting to auth');
        navigate('/auth');
      }
      
      // Block access to portal for unauthenticated users
      if (!authenticated && location.pathname.startsWith('/portal')) {
        console.log('useSupabaseAuth - Unauthenticated user trying to access portal, redirecting to auth');
        navigate('/auth');
      }
    }
  }, [user, session, isLoading, navigate, location.pathname]);

  return {
    user,
    session,
    isAuthenticated,
    isLoading
  };
};
