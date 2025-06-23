
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useCurrentTenant } from '@/hooks/useCurrentTenant';

export interface Event {
  id: string;
  name: string;
  event_type: string;
  event_date: string;
  slug: string;
  start_time: string | null;
  location: string | null;
  description: string | null;
  google_drive_url: string | null;
  status: string;
  created_at: string;
  updated_at: string;
  magic_word?: string | null;
  share_token?: string | null;
  tenant_id: string;
}

export const useEvents = () => {
  const { toast } = useToast();
  const { data: currentTenant } = useCurrentTenant();
  const [events, setEvents] = useState<Event[]>([]);
  const [currentEvent, setCurrentEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(false);

  const loadEvents = async () => {
    if (!currentTenant?.id) {
      console.log('useEvents - Aucun tenant disponible, chargement ignoré');
      return;
    }

    setLoading(true);
    try {
      console.log('useEvents - Chargement des événements pour le tenant:', currentTenant.id);
      
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('tenant_id', currentTenant.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      console.log('useEvents - Événements chargés:', data?.length || 0);
      setEvents(data || []);
      
      // Définir le premier événement comme actuel si aucun n'est sélectionné
      if (!currentEvent && data && data.length > 0) {
        setCurrentEvent(data[0]);
        localStorage.setItem('currentEventId', data[0].id);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des événements:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de charger les événements',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const createEvent = async (eventData: Omit<Event, 'id' | 'created_at' | 'updated_at' | 'tenant_id' | 'slug' | 'share_token'>) => {
    if (!currentTenant?.id) {
      toast({
        title: 'Erreur',
        description: 'Aucun tenant disponible',
        variant: 'destructive',
      });
      return null;
    }

    try {
      const slug = eventData.name.toLowerCase().replace(/\s+/g, '-') + '-' + Date.now();
      
      const { data, error } = await supabase
        .from('events')
        .insert({
          ...eventData,
          tenant_id: currentTenant.id,
          slug,
          share_token: crypto.randomUUID()
        })
        .select()
        .single();

      if (error) throw error;

      console.log('useEvents - Événement créé:', data);
      setEvents(prev => [data, ...prev]);
      
      if (!currentEvent) {
        setCurrentEvent(data);
        localStorage.setItem('currentEventId', data.id);
      }

      toast({
        title: 'Succès',
        description: 'Événement créé avec succès',
      });

      return data;
    } catch (error) {
      console.error('Erreur lors de la création de l\'événement:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de créer l\'événement',
        variant: 'destructive',
      });
      return null;
    }
  };

  const updateEventGoogleDriveUrl = async (eventId: string, googleDriveUrl: string) => {
    try {
      const { data, error } = await supabase
        .from('events')
        .update({ google_drive_url: googleDriveUrl })
        .eq('id', eventId)
        .select()
        .single();

      if (error) throw error;
      
      setEvents(prev => prev.map(event => 
        event.id === eventId ? { ...event, google_drive_url: googleDriveUrl } : event
      ));
      
      if (currentEvent?.id === eventId) {
        setCurrentEvent(prev => prev ? { ...prev, google_drive_url: googleDriveUrl } : null);
      }

      toast({
        title: 'Succès',
        description: 'URL Google Drive sauvegardée',
      });
    } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'URL Google Drive:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de sauvegarder l\'URL Google Drive',
        variant: 'destructive',
      });
    }
  };

  useEffect(() => {
    if (currentTenant?.id) {
      loadEvents();
    }
  }, [currentTenant?.id]);

  return {
    events,
    currentEvent,
    setCurrentEvent,
    loading,
    loadEvents,
    createEvent,
    updateEventGoogleDriveUrl
  };
};
