
import { createContext, useContext, ReactNode } from 'react';

type User = {
  id: string;
  email: string;
  user_metadata?: {
    full_name?: string;
  };
};

type Session = {
  user: User;
  access_token: string;
};

type AuthContextType = {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  signOut: () => Promise<void>;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (email: string, password: string, fullName?: string) => Promise<{ error: Error | null }>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Utilisateur par défaut pour l'app locale
const defaultUser: User = {
  id: 'local-user',
  email: 'user@jourm.local',
  user_metadata: {
    full_name: 'Utilisateur Local'
  }
};

const defaultSession: Session = {
  user: defaultUser,
  access_token: 'local-token'
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  // Toujours connecté en mode local
  const user = defaultUser;
  const session = defaultSession;
  const isLoading = false;

  const signOut = async () => {
    // Pas d'action nécessaire en mode local
  };

  const signIn = async (email: string, password: string) => {
    // Toujours réussi en mode local
    return { error: null };
  };

  const signUp = async (email: string, password: string, fullName?: string) => {
    // Toujours réussi en mode local
    return { error: null };
  };

  const value = {
    user,
    session,
    isLoading,
    signOut,
    signIn,
    signUp,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
