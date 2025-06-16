
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface TokenValidationResult {
  isValid: boolean;
  loading: boolean;
  error: string | null;
  event: any | null;
}

export const useTokenValidation = (eventId: string, shareToken: string): TokenValidationResult => {
  const [isValid, setIsValid] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [event, setEvent] = useState<any | null>(null);

  useEffect(() => {
    const validateToken = async () => {
      if (!eventId || !shareToken) {
        setError('Paramètres manquants');
        setLoading(false);
        return;
      }

      try {
        console.log('TokenValidation - Validating token for event:', eventId);
        
        const { data: eventData, error: eventError } = await supabase
          .from('events')
          .select('id, name, event_type, event_date, start_time, location, description, share_token')
          .eq('id', eventId)
          .eq('share_token', shareToken)
          .single();

        if (eventError || !eventData) {
          console.error('TokenValidation - Token validation failed:', eventError);
          setError('Lien invalide ou expiré');
          setIsValid(false);
        } else {
          console.log('TokenValidation - Token validated successfully for event:', eventData.name);
          setEvent(eventData);
          setIsValid(true);
          setError(null);
        }
      } catch (error) {
        console.error('TokenValidation - Error during validation:', error);
        setError('Erreur lors de la validation du lien');
        setIsValid(false);
      } finally {
        setLoading(false);
      }
    };

    validateToken();
  }, [eventId, shareToken]);

  return {
    isValid,
    loading,
    error,
    event
  };
};
