
import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export const useSupabaseAuth = () => {
  const { user, session, isLoading } = useAuth();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading) {
      const authenticated = !!(user && session);
      setIsAuthenticated(authenticated);
      
      // Auto-redirect to login if not authenticated
      if (!authenticated && window.location.pathname !== '/auth' && window.location.pathname !== '/') {
        navigate('/auth');
      }
    }
  }, [user, session, isLoading, navigate]);

  return {
    user,
    session,
    isAuthenticated,
    isLoading
  };
};
