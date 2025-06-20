
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
      
      // Auto-redirect to login if not authenticated, but avoid redirecting from specific pages
      const allowedPaths = ['/auth', '/', '/equipe'];
      const isAllowedPath = allowedPaths.includes(location.pathname) || 
                           location.pathname.startsWith('/portal'); // Allow portal access for token-based users
      
      if (!authenticated && !isAllowedPath) {
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
