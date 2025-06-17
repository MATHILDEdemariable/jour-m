
import React, { createContext, useContext } from 'react';
import { useEventStore } from '@/stores/eventStore';

interface CurrentEventContextType {
  currentEventId: string;
  setCurrentEventId: (id: string) => void;
}

const LocalCurrentEventContext = createContext<CurrentEventContextType | undefined>(undefined);

export const LocalCurrentEventProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentEventId, setCurrentEventId } = useEventStore();

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
