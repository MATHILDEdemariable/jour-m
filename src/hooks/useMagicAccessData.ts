
import { useEffect, useState } from 'react';
import { useCurrentEvent } from '@/contexts/CurrentEventContext';
import { usePeople } from '@/hooks/usePeople';
import { useVendors } from '@/hooks/useVendors';
import { useSharedEventData } from '@/hooks/useSharedEventData';

export const useMagicAccessData = (eventId: string) => {
  const { setCurrentEventId } = useCurrentEvent();
  const { loadPeople } = usePeople();
  const { loadVendors } = useVendors();
  const { refreshData } = useSharedEventData();
  const [isInitialized, setIsInitialized] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    const initializeMagicAccess = async () => {
      console.log('useMagicAccessData - Initializing magic access for event:', eventId);
      
      // S'assurer que l'event ID est défini dans le contexte
      setCurrentEventId(eventId);
      
      try {
        // Forcer le chargement des données avec retry
        await Promise.all([
          loadPeople(),
          loadVendors(),
          refreshData()
        ]);
        
        console.log('useMagicAccessData - Data loaded successfully');
        setIsInitialized(true);
        
      } catch (error) {
        console.error('useMagicAccessData - Error loading data:', error);
        
        // Retry logic
        if (retryCount < 3) {
          console.log('useMagicAccessData - Retrying data load in 2 seconds...');
          setTimeout(() => {
            setRetryCount(prev => prev + 1);
          }, 2000);
        }
      }
    };

    if (eventId && !isInitialized) {
      initializeMagicAccess();
    }
  }, [eventId, setCurrentEventId, loadPeople, loadVendors, refreshData, isInitialized, retryCount]);

  return { isInitialized };
};
