
import React, { createContext, useContext } from 'react';
import { useAuth } from '@/contexts/AuthContext';

// Nouveau contexte basé sur la session Supabase Auth existante (utilisateur connecté)
type AdminAuthContextType = {
  isAuthenticated: boolean;
  logout: () => void;
};

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export const AdminAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, signOut } = useAuth();

  return (
    <AdminAuthContext.Provider value={{
      isAuthenticated: !!user,
      logout: signOut
    }}>
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
