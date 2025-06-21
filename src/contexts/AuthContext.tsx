
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
          console.log('User signed in successfully, loading tenant data');
          // Defer tenant loading to prevent deadlocks
          setTimeout(async () => {
            await loadUserTenant(session.user.id);
          }, 0);
        } else if (event === 'SIGNED_OUT') {
          console.log('User signed out, clearing tenant data');
          setCurrentTenantId(null);
        }
        
        setIsLoading(false);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('Initial session check:', session?.user?.id);
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
      console.log('Loading tenant for user:', userId);
      const { data, error } = await supabase
        .from('tenant_users')
        .select('tenant_id')
        .eq('user_id', userId)
        .maybeSingle();

      if (error) {
        console.error('Error loading user tenant:', error);
        // Les politiques RLS simplifiées ne devraient plus causer d'erreurs de récursion
        if (error.message.includes('infinite recursion')) {
          toast({
            title: 'Erreur système',
            description: 'Problème de configuration détecté. Veuillez contacter le support.',
            variant: 'destructive',
          });
        } else if (error.code !== 'PGRST116') {
          toast({
            title: 'Erreur de chargement',
            description: 'Impossible de charger les informations du tenant',
            variant: 'destructive',
          });
        }
        return;
      }

      if (data) {
        console.log('Tenant loaded:', data.tenant_id);
        setCurrentTenantId(data.tenant_id);
      } else {
        console.log('No tenant found for user, will be created during signup flow');
        setCurrentTenantId(null);
      }
    } catch (error) {
      console.error('Error loading user tenant:', error);
      toast({
        title: 'Erreur de connexion',
        description: 'Problème de connexion aux données utilisateur',
        variant: 'destructive',
      });
    }
  };

  const createTenantForUser = async (userId: string, userName: string) => {
    try {
      console.log('Creating tenant for user:', userId, userName);
      
      // Create tenant
      const { data: tenant, error: tenantError } = await supabase
        .from('tenants')
        .insert({ name: `Espace de ${userName}` })
        .select()
        .single();

      if (tenantError) {
        console.error('Error creating tenant:', tenantError);
        throw tenantError;
      }

      console.log('Tenant created:', tenant.id);

      // Link user to tenant avec les nouvelles politiques RLS simplifiées
      const { error: linkError } = await supabase
        .from('tenant_users')
        .insert({
          user_id: userId,
          tenant_id: tenant.id,
          role: 'admin'
        });

      if (linkError) {
        console.error('Error linking user to tenant:', linkError);
        throw linkError;
      }

      console.log('User linked to tenant successfully');
      setCurrentTenantId(tenant.id);
      return tenant.id;
    } catch (error) {
      console.error('Error creating tenant:', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      console.log('Signing out user');
      setCurrentTenantId(null);
      const { error } = await supabase.auth.signOut({ scope: 'global' });
      if (error) throw error;
      
      console.log('Sign out successful, redirecting to auth');
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
      console.log('Attempting to sign in user:', email);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Sign in error:', error);
        throw error;
      }
      
      console.log('Sign in successful for user:', data.user?.id);
      
      // Success toast will be shown by the Auth page
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
      // Use the production URL for redirect
      const redirectUrl = 'https://jour-m.lovable.app/';
      
      console.log('Signing up with redirect URL:', redirectUrl);
      
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

      if (error) {
        console.error('Sign up error:', error);
        throw error;
      }

      console.log('Sign up response:', { user: data.user?.id, session: !!data.session });

      if (data.user && !data.session) {
        // Email confirmation required
        console.log('Email confirmation required for user:', data.user.id);
        toast({
          title: 'Confirmation requise',
          description: 'Vérifiez votre email pour confirmer votre compte',
        });
      } else if (data.user && data.session) {
        // User signed up and logged in immediately
        console.log('User signed up and logged in immediately:', data.user.id);
        try {
          await createTenantForUser(data.user.id, fullName || 'Utilisateur');
          toast({
            title: 'Compte créé avec succès',
            description: 'Bienvenue dans votre espace JOURM !',
          });
        } catch (tenantError) {
          console.error('Error creating tenant during signup:', tenantError);
          toast({
            title: 'Compte créé',
            description: 'Compte créé mais problème lors de l\'initialisation. Reconnectez-vous.',
            variant: 'destructive',
          });
        }
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
