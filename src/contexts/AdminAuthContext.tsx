
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

type AdminAuthContextType = {
  isAuthenticated: boolean;
  login: (password: string) => Promise<boolean>;
  logout: () => void;
  error: string | null;
};

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export const AdminAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  
  // Vérifier si l'utilisateur est déjà authentifié (localStorage)
  useEffect(() => {
    const adminAuth = localStorage.getItem('adminAuth');
    if (adminAuth === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const login = async (password: string): Promise<boolean> => {
    setError(null);
    
    try {
      const { data, error: fetchError } = await supabase
        .from('admin_settings')
        .select('setting_value')
        .eq('setting_key', 'admin_password')
        .single();

      if (fetchError || !data) {
        console.error('Error fetching admin password:', fetchError);
        setError('Erreur de configuration du serveur. Impossible de vérifier le mot de passe.');
        toast({
          variant: "destructive",
          title: "Erreur de configuration",
          description: "Impossible de vérifier le mot de passe administrateur.",
        });
        return false;
      }
      
      if (password === data.setting_value) {
        setIsAuthenticated(true);
        localStorage.setItem('adminAuth', 'true');
        toast({
          title: "Connexion réussie",
          description: "Bienvenue dans le portail administrateur",
        });
        return true;
      } else {
        setError('Mot de passe incorrect');
        toast({
          variant: "destructive",
          title: "Erreur de connexion",
          description: "Le mot de passe est incorrect",
        });
        return false;
      }
    } catch(e) {
      const err = e as Error;
      console.error('Login failed:', err.message);
      setError('Une erreur inattendue est survenue.');
      toast({
        variant: "destructive",
        title: "Erreur de connexion",
        description: "Une erreur inattendue est survenue.",
      });
      return false;
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('adminAuth');
    toast({
      title: "Déconnexion",
      description: "Vous êtes maintenant déconnecté",
    });
  };

  return (
    <AdminAuthContext.Provider value={{ isAuthenticated, login, logout, error }}>
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = (): AdminAuthContextType => {
  const context = useContext(AdminAuthContext);
  if (context === undefined) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
};
