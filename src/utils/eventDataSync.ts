
import { useEffect, useRef } from 'react';

export const useEventSync = (data: any[], onDataChange?: () => void) => {
  const previousDataRef = useRef(data);
  
  useEffect(() => {
    const previousData = previousDataRef.current;
    const hasChanged = JSON.stringify(previousData) !== JSON.stringify(data);
    
    if (hasChanged && onDataChange) {
      onDataChange();
    }
    
    previousDataRef.current = data;
  }, [data, onDataChange]);
  
  return { hasChanged: JSON.stringify(previousDataRef.current) !== JSON.stringify(data) };
};

export const calculateProgressPercentage = (completed: number, total: number) => {
  return total > 0 ? Math.round((completed / total) * 100) : 0;
};

export const formatDaysUntilEvent = (days: number) => {
  if (days === 0) return "Aujourd'hui";
  if (days === 1) return "Demain";
  if (days < 0) return `Il y a ${Math.abs(days)} jour(s)`;
  return `Dans ${days} jour(s)`;
};

export const getUrgencyLevel = (days: number) => {
  if (days <= 0) return 'urgent';
  if (days <= 7) return 'warning';
  if (days <= 30) return 'normal';
  return 'planning';
};
