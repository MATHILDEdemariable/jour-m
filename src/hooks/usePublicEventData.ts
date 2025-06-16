
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export interface PublicEventData {
  event: {
    id: string;
    name: string;
    event_type: string;
    event_date: string;
    start_time: string | null;
    location: string | null;
    description: string | null;
  };
  people: any[];
  vendors: any[];
  timelineItems: any[];
  documents: any[];
}

export const usePublicEventData = (eventId: string, shareToken: string) => {
  const { toast } = useToast();
  const [data, setData] = useState<PublicEventData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const validateTokenAndLoadData = async () => {
    if (!eventId || !shareToken) {
      setError('Paramètres manquants');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Valider le token et récupérer l'événement
      const { data: event, error: eventError } = await supabase
        .from('events')
        .select('id, name, event_type, event_date, start_time, location, description')
        .eq('id', eventId)
        .eq('share_token', shareToken)
        .single();

      if (eventError || !event) {
        setError('Lien invalide ou expiré');
        setLoading(false);
        return;
      }

      // Charger les données associées
      const [peopleResult, vendorsResult, timelineResult, documentsResult] = await Promise.all([
        supabase
          .from('people')
          .select('*')
          .eq('event_id', eventId),
        
        supabase
          .from('vendors')
          .select('*')
          .eq('event_id', eventId),
        
        supabase
          .from('timeline_items')
          .select('*')
          .eq('event_id', eventId)
          .order('time'),
        
        supabase
          .from('event_documents')
          .select('*')
          .eq('event_id', eventId)
      ]);

      setData({
        event,
        people: peopleResult.data || [],
        vendors: vendorsResult.data || [],
        timelineItems: timelineResult.data || [],
        documents: documentsResult.data || []
      });

    } catch (error) {
      console.error('Error loading public event data:', error);
      setError('Erreur lors du chargement des données');
      toast({
        title: 'Erreur',
        description: 'Impossible de charger les données de l\'événement',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    validateTokenAndLoadData();
  }, [eventId, shareToken]);

  return {
    data,
    loading,
    error,
    refresh: validateTokenAndLoadData
  };
};
