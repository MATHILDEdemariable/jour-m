
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

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

export const usePeople = () => {
  const { toast } = useToast();
  const [people, setPeople] = useState<Person[]>([]);
  const [loading, setLoading] = useState(false);

  // Load people from Supabase
  const loadPeople = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('people')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPeople(data || []);
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

  // Load people on component mount
  useEffect(() => {
    loadPeople();
  }, []);

  const addPerson = async (newPerson: Omit<Person, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('people')
        .insert(newPerson)
        .select()
        .single();

      if (error) throw error;
      
      setPeople(prev => [data, ...prev]);
      toast({
        title: 'Succès',
        description: 'Personne ajoutée avec succès',
      });
      
      return data;
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
      const { data, error } = await supabase
        .from('people')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      setPeople(prev => prev.map(person => 
        person.id === id ? { ...person, ...data } : person
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
