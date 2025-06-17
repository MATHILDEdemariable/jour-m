
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useEventStore } from '@/stores/eventStore';

interface CurrentEventContextType {
  currentEventId: string;
  setCurrentEventId: (id: string) => void;
}

const LocalCurrentEventContext = createContext<CurrentEventContextType | undefined>(undefined);

export const LocalCurrentEventProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { events, addEvent } = useEventStore();
  
  // TOUJOURS avoir un ID d'événement valide
  const [currentEventId, setCurrentEventIdState] = useState(() => {
    const stored = localStorage.getItem('currentEventId');
    return stored || 'default-event';
  });

  // AUTOMATIQUEMENT sauvegarder les changements
  const setCurrentEventId = (eventId: string) => {
    setCurrentEventIdState(eventId);
    localStorage.setItem('currentEventId', eventId);
    console.log('LocalCurrentEventContext - Current event changed to:', eventId);
  };

  // INITIALISER l'événement par défaut si nécessaire
  useEffect(() => {
    if (!currentEventId || currentEventId === '') {
      setCurrentEventId('default-event');
    }
    
    // Vérifier si l'événement existe, sinon le créer
    const eventExists = events.find(e => e.id === currentEventId);
    if (!eventExists && currentEventId === 'default-event') {
      console.log('LocalCurrentEventContext - Creating default event');
      const defaultEvent = {
        id: 'default-event',
        name: 'Mon Événement',
        event_type: 'mariage',
        event_date: new Date().toISOString().split('T')[0] + 'T12:00:00.000Z',
        location: '',
        description: 'Description de l\'événement',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      addEvent(defaultEvent);
    }
  }, [currentEventId, events, addEvent]);

  return (
    <LocalCurrentEventContext.Provider value={{ currentEventId, setCurrentEventId }}>
      {children}
    </LocalCurrentEventContext.Provider>
  );
};

export const useLocalCurrentEvent = () => {
  const context = useContext(LocalCurrentEventContext);
  if (context === undefined) {
    throw new Error('useLocalCurrentEvent must be used within a LocalCurrentEventProvider');
  }
  return context;
};
