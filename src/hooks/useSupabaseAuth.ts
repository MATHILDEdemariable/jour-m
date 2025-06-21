
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
      
      console.log('Auth state updated:', { 
        authenticated, 
        currentPath: location.pathname,
        user: user?.id,
        session: !!session 
      });
      
      // Rediriger vers le portail si l'utilisateur est authentifié et sur la page auth
      if (authenticated && location.pathname === '/auth') {
        console.log('User authenticated on auth page, redirecting to portal');
        navigate('/portal', { replace: true });
        return;
      }
      
      // Rediriger vers auth si pas authentifié et sur une page protégée
      const publicPaths = ['/auth', '/', '/equipe'];
      const isPublicPath = publicPaths.includes(location.pathname) || 
                          location.pathname.startsWith('/portal'); // Permettre l'accès au portail uniquement si authentifié
      
      if (!authenticated && !isPublicPath) {
        console.log('User not authenticated on protected page, redirecting to auth');
        navigate('/auth');
      }
      
      // Bloquer l'accès au portail pour les utilisateurs non authentifiés
      if (!authenticated && location.pathname.startsWith('/portal')) {
        console.log('Unauthenticated user trying to access portal, redirecting to auth');
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
