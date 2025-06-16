
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useSharedEventData } from '@/hooks/useSharedEventData';

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
  const [isTokenValidated, setIsTokenValidated] = useState(false);

  // Utiliser useSharedEventData pour synchroniser avec l'admin
  const {
    people,
    vendors,
    timelineItems,
    refreshData
  } = useSharedEventData();

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

      setIsTokenValidated(true);

      // Forcer le refresh des données partagées
      await refreshData();

      // Charger les documents
      const { data: documents, error: documentsError } = await supabase
        .from('event_documents')
        .select('*')
        .eq('event_id', eventId);

      if (documentsError) {
        console.error('Error loading documents:', documentsError);
      }

      setData({
        event,
        people: people || [],
        vendors: vendors || [],
        timelineItems: timelineItems || [],
        documents: documents || []
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

  // Mettre à jour les données quand useSharedEventData change
  useEffect(() => {
    if (isTokenValidated && data) {
      setData(prev => prev ? {
        ...prev,
        people: people || [],
        vendors: vendors || [],
        timelineItems: timelineItems || []
      } : null);
    }
  }, [people, vendors, timelineItems, isTokenValidated]);

  return {
    data,
    loading,
    error,
    refresh: validateTokenAndLoadData
  };
};
