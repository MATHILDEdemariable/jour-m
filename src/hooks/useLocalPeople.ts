
import { useState } from 'react';
import { useEventStore } from '@/stores/eventStore';
import type { Person } from '@/stores/eventStore';

// Hook qui remplace usePeople en gardant exactement la même interface
export const useLocalPeople = () => {
  const {
    people,
    addPerson: addPersonToStore,
    updatePerson: updatePersonInStore,
    deletePerson: deletePersonFromStore,
    loading
  } = useEventStore();

  const [localLoading, setLocalLoading] = useState(false);

  const generateId = () => `person-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  const loadPeople = async () => {
    setLocalLoading(true);
    // Simulate async operation for compatibility
    await new Promise(resolve => setTimeout(resolve, 100));
    setLocalLoading(false);
    console.log('useLocalPeople - People loaded from localStorage');
  };

  const addPerson = async (newPerson: Omit<Person, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const currentEventId = localStorage.getItem('currentEventId') || 'default-event';
      
      const person: Person = {
        ...newPerson,
        id: generateId(),
        event_id: currentEventId, // ESSENTIEL - utiliser l'event_id actuel
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      console.log('useLocalPeople - Adding person with event_id:', currentEventId, person);
      addPersonToStore(person);
      return person;
    } catch (error) {
      console.error('Error adding person:', error);
      throw error;
    }
  };

  const updatePerson = async (id: string, updates: Partial<Person>) => {
    try {
      const updatedData = {
        ...updates,
        updated_at: new Date().toISOString()
      };
      updatePersonInStore(id, updatedData);
      console.log('useLocalPeople - Person updated:', id);
    } catch (error) {
      console.error('Error updating person:', error);
      throw error;
    }
  };

  const deletePerson = async (id: string) => {
    try {
      deletePersonFromStore(id);
      console.log('useLocalPeople - Person deleted:', id);
    } catch (error) {
      console.error('Error deleting person:', error);
      throw error;
    }
  };

  return {
    people,
    loading: loading || localLoading,
    loadPeople,
    addPerson,
    updatePerson,
    deletePerson
  };
};
