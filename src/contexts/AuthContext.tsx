
import { createContext, useContext, ReactNode, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';
import { useToast } from '@/hooks/use-toast';

type AuthContextType = {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  signOut: () => Promise<void>;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (email: string, password: string, fullName?: string) => Promise<{ error: Error | null }>;
  currentTenantId: string | null;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentTenantId, setCurrentTenantId] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.id);
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user && event === 'SIGNED_IN') {
          // Defer tenant loading to prevent deadlocks
          setTimeout(async () => {
            await loadUserTenant(session.user.id);
          }, 0);
        } else if (event === 'SIGNED_OUT') {
          setCurrentTenantId(null);
        }
        
        setIsLoading(false);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        loadUserTenant(session.user.id);
      }
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const loadUserTenant = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('tenant_users')
        .select('tenant_id')
        .eq('user_id', userId)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error loading user tenant:', error);
        return;
      }

      if (data) {
        setCurrentTenantId(data.tenant_id);
      }
    } catch (error) {
      console.error('Error loading user tenant:', error);
    }
  };

  const createTenantForUser = async (userId: string, userName: string) => {
    try {
      // Create tenant
      const { data: tenant, error: tenantError } = await supabase
        .from('tenants')
        .insert({ name: `Espace de ${userName}` })
        .select()
        .single();

      if (tenantError) throw tenantError;

      // Link user to tenant
      const { error: linkError } = await supabase
        .from('tenant_users')
        .insert({
          user_id: userId,
          tenant_id: tenant.id,
          role: 'admin'
        });

      if (linkError) throw linkError;

      setCurrentTenantId(tenant.id);
      return tenant.id;
    } catch (error) {
      console.error('Error creating tenant:', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      setCurrentTenantId(null);
      const { error } = await supabase.auth.signOut({ scope: 'global' });
      if (error) throw error;
      
      // Force page reload for clean state
      window.location.href = '/auth';
    } catch (error) {
      console.error('Error signing out:', error);
      toast({
        title: 'Erreur de déconnexion',
        description: 'Une erreur est survenue lors de la déconnexion',
        variant: 'destructive',
      });
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      
      return { error: null };
    } catch (error) {
      console.error('Sign in error:', error);
      return { error: error as Error };
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (email: string, password: string, fullName?: string) => {
    try {
      setIsLoading(true);
      const redirectUrl = 'https://jour-m.lovable.app/';
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            full_name: fullName || ''
          }
        }
      });

      if (error) throw error;

      if (data.user && !data.session) {
        // Email confirmation required
        toast({
          title: 'Confirmation requise',
          description: 'Vérifiez votre email pour confirmer votre compte',
        });
      } else if (data.user && data.session) {
        // User signed up and logged in
        await createTenantForUser(data.user.id, fullName || 'Utilisateur');
        toast({
          title: 'Compte créé avec succès',
          description: 'Bienvenue dans votre espace JOURM !',
        });
      }
      
      return { error: null };
    } catch (error) {
      console.error('Sign up error:', error);
      return { error: error as Error };
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    user,
    session,
    isLoading,
    signOut,
    signIn,
    signUp,
    currentTenantId,
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
