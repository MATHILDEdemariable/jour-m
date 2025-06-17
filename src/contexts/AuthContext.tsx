
import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

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

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check for existing auth in localStorage
    const savedAuth = localStorage.getItem('jourm-auth');
    if (savedAuth) {
      try {
        const authData = JSON.parse(savedAuth);
        setUser(authData.user);
        setSession(authData.session);
      } catch (error) {
        localStorage.removeItem('jourm-auth');
      }
    }
    setIsLoading(false);
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      // Simple auth - just check if it's a valid email format
      if (!email.includes('@')) {
        return { error: new Error('Email invalide') };
      }
      
      const user: User = {
        id: `user-${Date.now()}`,
        email,
        user_metadata: {}
      };
      
      const session: Session = {
        user,
        access_token: `token-${Date.now()}`
      };
      
      const authData = { user, session };
      localStorage.setItem('jourm-auth', JSON.stringify(authData));
      
      setUser(user);
      setSession(session);
      
      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const signUp = async (email: string, password: string, fullName?: string) => {
    try {
      if (!email.includes('@')) {
        return { error: new Error('Email invalide') };
      }
      
      const user: User = {
        id: `user-${Date.now()}`,
        email,
        user_metadata: {
          full_name: fullName
        }
      };
      
      const session: Session = {
        user,
        access_token: `token-${Date.now()}`
      };
      
      const authData = { user, session };
      localStorage.setItem('jourm-auth', JSON.stringify(authData));
      
      setUser(user);
      setSession(session);
      
      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const signOut = async () => {
    localStorage.removeItem('jourm-auth');
    setUser(null);
    setSession(null);
    navigate('/');
  };

  const value = {
    user,
    session,
    isLoading,
    signOut,
    signIn,
    signUp,
  };

  return <AuthContext.Provider value={value}>{!isLoading && children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
