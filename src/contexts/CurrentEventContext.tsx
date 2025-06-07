
import React, { createContext, useContext, useState } from 'react';

interface CurrentEventContextType {
  currentEventId: string;
  setCurrentEventId: (id: string) => void;
}

const CurrentEventContext = createContext<CurrentEventContextType | undefined>(undefined);

// UUID de l'événement par défaut créé en base
const DEFAULT_EVENT_ID = 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11';

export const CurrentEventProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentEventId, setCurrentEventId] = useState(DEFAULT_EVENT_ID);

  return (
    <CurrentEventContext.Provider value={{ currentEventId, setCurrentEventId }}>
      {children}
    </CurrentEventContext.Provider>
  );
};

export const useCurrentEvent = () => {
  const context = useContext(CurrentEventContext);
  if (context === undefined) {
    throw new Error('useCurrentEvent must be used within a CurrentEventProvider');
  }
  return context;
};
