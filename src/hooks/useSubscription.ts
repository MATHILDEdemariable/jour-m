
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface Subscription {
  id: string;
  plan_type: 'free' | 'premium' | 'pro';
  status: 'active' | 'canceled' | 'expired';
  current_period_end?: string;
  cancel_at_period_end?: boolean;
}

export const useSubscription = () => {
  const { user } = useAuth();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setSubscription(null);
      setLoading(false);
      return;
    }

    const fetchSubscription = async () => {
      try {
        const { data, error } = await supabase
          .from('subscriptions')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (error && error.code !== 'PGRST116') {
          console.error('Error fetching subscription:', error);
          return;
        }

        setSubscription(data);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSubscription();
  }, [user]);

  const canCreateEvents = (eventCount: number) => {
    if (!subscription) return false;
    
    switch (subscription.plan_type) {
      case 'free':
        return eventCount < 1;
      case 'premium':
      case 'pro':
        return true;
      default:
        return false;
    }
  };

  const getPlanLimits = () => {
    switch (subscription?.plan_type) {
      case 'free':
        return { events: 1, storage: '100MB', features: ['Basic planning'] };
      case 'premium':
        return { events: 'Unlimited', storage: '5GB', features: ['Advanced planning', 'AI suggestions', 'Priority support'] };
      case 'pro':
        return { events: 'Unlimited', storage: '50GB', features: ['All Premium features', 'White-label', 'API access', 'Custom integrations'] };
      default:
        return { events: 0, storage: '0MB', features: [] };
    }
  };

  return {
    subscription,
    loading,
    canCreateEvents,
    getPlanLimits,
    isPremium: subscription?.plan_type === 'premium' || subscription?.plan_type === 'pro',
    isPro: subscription?.plan_type === 'pro',
  };
};
