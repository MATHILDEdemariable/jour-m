
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useCurrentTenant } from '@/hooks/useCurrentTenant';

export interface Person {
  id: string;
  name: string;
  role: string | null;
  email: string | null;
  phone: string | null;
  confirmation_status: string | null;
  availability_notes: string | null;
  event_id: string | null;
  tenant_id: string;
  created_at: string;
  updated_at: string;
}

export const usePeople = () => {
  const { toast } = useToast();
  const { currentTenant } = useCurrentTenant();
  const [people, setPeople] = useState<Person[]>([]);
  const [loading, setLoading] = useState(false);

  const loadPeople = async () => {
    if (!currentTenant?.id) {
      console.log('usePeople - No tenant available, skipping load');
      return;
    }

    setLoading(true);
    try {
      console.log('usePeople - Loading people for tenant:', currentTenant.id);
      
      const { data, error } = await supabase
        .from('people')
        .select('*')
        .eq('tenant_id', currentTenant.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      console.log('usePeople - People loaded:', data?.length || 0);
      setPeople(data || []);
    } catch (error) {
      console.error('Erreur lors du chargement des personnes:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de charger les personnes',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const addPerson = async (newPerson: Omit<Person, 'id' | 'created_at' | 'updated_at' | 'tenant_id'>) => {
    if (!currentTenant?.id) {
      toast({
        title: 'Erreur',
        description: 'Aucun tenant disponible',
        variant: 'destructive',
      });
      return null;
    }

    try {
      const { data, error } = await supabase
        .from('people')
        .insert({
          ...newPerson,
          tenant_id: currentTenant.id
        })
        .select()
        .single();

      if (error) throw error;

      console.log('usePeople - Person added:', data);
      setPeople(prev => [data, ...prev]);
      
      toast({
        title: 'Succès',
        description: 'Personne ajoutée avec succès',
      });

      return data;
    } catch (error) {
      console.error('Erreur lors de l\'ajout de la personne:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible d\'ajouter la personne',
        variant: 'destructive',
      });
      return null;
    }
  };

  const updatePerson = async (id: string, updates: Partial<Person>) => {
    try {
      const { data, error } = await supabase
        .from('people')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      console.log('usePeople - Person updated:', data);
      setPeople(prev => prev.map(person => 
        person.id === id ? data : person
      ));

      toast({
        title: 'Succès',
        description: 'Personne mise à jour avec succès',
      });
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la personne:', error);
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

      console.log('usePeople - Person deleted:', id);
      setPeople(prev => prev.filter(person => person.id !== id));

      toast({
        title: 'Succès',
        description: 'Personne supprimée avec succès',
      });
    } catch (error) {
      console.error('Erreur lors de la suppression de la personne:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de supprimer la personne',
        variant: 'destructive',
      });
    }
  };

  useEffect(() => {
    if (currentTenant?.id) {
      loadPeople();
    }
  }, [currentTenant?.id]);

  return {
    people,
    loading,
    loadPeople,
    addPerson,
    updatePerson,
    deletePerson
  };
};
