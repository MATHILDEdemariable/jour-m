import { useState, useEffect, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useCurrentEvent } from '@/contexts/CurrentEventContext';

export interface Person {
  id: string;
  name: string;
  role: string;
  email: string;
  phone: string;
  availability: string;
  status: string;
  event_id?: string;
  created_at?: string;
  updated_at?: string;
}

export const usePeople = (eventId?: string) => {
  const { toast } = useToast();
  const { currentEventId: contextEventId } = useCurrentEvent();
  const eventIdToUse = eventId || contextEventId;

  const [people, setPeople] = useState<Person[]>([]);
  const [loading, setLoading] = useState(false);
  const subscriptionRef = useRef<any>(null);

  // Load people from Supabase
  const loadPeople = async () => {
    if (!eventIdToUse) {
      console.log('usePeople - No event ID provided, skipping load.');
      setPeople([]);
      return;
    }
    setLoading(true);
    try {
      console.log('usePeople - Loading people for event ID:', eventIdToUse);
      
      const { data, error } = await supabase
        .from('people')
        .select('*')
        .eq('event_id', eventIdToUse)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Map database fields to our interface
      const mappedPeople = (data || []).map(person => ({
        id: person.id,
        name: person.name || '',
        role: person.role || '',
        email: person.email || '',
        phone: person.phone || '',
        availability: person.availability_notes || 'full',
        status: person.confirmation_status || 'pending',
        event_id: person.event_id,
        created_at: person.created_at,
        updated_at: person.updated_at,
      }));
      
      console.log('usePeople - Loaded people:', mappedPeople);
      setPeople(mappedPeople);
    } catch (error) {
      console.error('Error loading people:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de charger les personnes',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // Combined useEffect for loading and realtime subscription
  useEffect(() => {
    if (!eventIdToUse) return;

    // Cleanup previous subscription
    if (subscriptionRef.current) {
      console.log('usePeople - Cleaning up previous subscription');
      subscriptionRef.current.unsubscribe();
      subscriptionRef.current = null;
    }

    // Load initial data
    loadPeople();

    // Setup realtime subscription with unique channel name
    const channelName = `people_changes_${eventIdToUse}_${Date.now()}`;
    console.log('usePeople - Setting up realtime subscription:', channelName);
    
    try {
      const subscription = supabase
        .channel(channelName)
        .on('postgres_changes', 
          { 
            event: '*', 
            schema: 'public', 
            table: 'people',
            filter: `event_id=eq.${eventIdToUse}`
          }, 
          (payload) => {
            console.log('usePeople - Realtime update received:', payload);
            loadPeople(); // Reload data when changes occur
          }
        )
        .subscribe();

      subscriptionRef.current = subscription;
    } catch (error) {
      console.error('usePeople - Error setting up subscription:', error);
    }

    return () => {
      if (subscriptionRef.current) {
        console.log('usePeople - Cleaning up realtime subscription');
        subscriptionRef.current.unsubscribe();
        subscriptionRef.current = null;
      }
    };
  }, [eventIdToUse]);

  const addPerson = async (newPerson: Omit<Person, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      // TOUJOURS assigner l'event_id actuel
      const personWithEventId = {
        ...newPerson,
        event_id: eventIdToUse || newPerson.event_id
      };

      console.log('usePeople - Adding person with event_id:', personWithEventId);

      // Map our interface to database fields
      const dbPerson = {
        name: personWithEventId.name,
        role: personWithEventId.role,
        email: personWithEventId.email,
        phone: personWithEventId.phone,
        availability_notes: personWithEventId.availability,
        confirmation_status: personWithEventId.status,
        event_id: personWithEventId.event_id,
      };

      const { data, error } = await supabase
        .from('people')
        .insert(dbPerson)
        .select()
        .single();

      if (error) throw error;
      
      // Map back to our interface
      const mappedPerson = {
        id: data.id,
        name: data.name || '',
        role: data.role || '',
        email: data.email || '',
        phone: data.phone || '',
        availability: data.availability_notes || 'full',
        status: data.confirmation_status || 'pending',
        event_id: data.event_id,
        created_at: data.created_at,
        updated_at: data.updated_at,
      };
      
      setPeople(prev => [mappedPerson, ...prev]);
      toast({
        title: 'Succès',
        description: 'Personne ajoutée avec succès',
      });
      
      return mappedPerson;
    } catch (error) {
      console.error('Error adding person:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible d\'ajouter la personne',
        variant: 'destructive',
      });
      throw error;
    }
  };

  const updatePerson = async (id: string, updates: Partial<Person>) => {
    try {
      // Map our interface to database fields
      const dbUpdates: any = {};
      if (updates.name !== undefined) dbUpdates.name = updates.name;
      if (updates.role !== undefined) dbUpdates.role = updates.role;
      if (updates.email !== undefined) dbUpdates.email = updates.email;
      if (updates.phone !== undefined) dbUpdates.phone = updates.phone;
      if (updates.availability !== undefined) dbUpdates.availability_notes = updates.availability;
      if (updates.status !== undefined) dbUpdates.confirmation_status = updates.status;
      if (updates.event_id !== undefined) dbUpdates.event_id = updates.event_id;

      const { data, error } = await supabase
        .from('people')
        .update(dbUpdates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      // Map back to our interface
      const mappedPerson = {
        id: data.id,
        name: data.name || '',
        role: data.role || '',
        email: data.email || '',
        phone: data.phone || '',
        availability: data.availability_notes || 'full',
        status: data.confirmation_status || 'pending',
        event_id: data.event_id,
        created_at: data.created_at,
        updated_at: data.updated_at,
      };
      
      setPeople(prev => prev.map(person => 
        person.id === id ? { ...person, ...mappedPerson } : person
      ));
      
      toast({
        title: 'Succès',
        description: 'Personne mise à jour avec succès',
      });
    } catch (error) {
      console.error('Error updating person:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de mettre à jour la personne',
        variant: 'destructive',
      });
    }
  };

  const deletePerson = async (id: string) => {
    try {
      const { error } = await supabase
        .from('people')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setPeople(prev => prev.filter(person => person.id !== id));
      toast({
        title: 'Succès',
        description: 'Personne supprimée avec succès',
      });
    } catch (error) {
      console.error('Error deleting person:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de supprimer la personne',
        variant: 'destructive',
      });
    }
  };

  return {
    people,
    loading,
    loadPeople,
    addPerson,
    updatePerson,
    deletePerson
  };
};
