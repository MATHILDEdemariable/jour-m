
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useTasks } from '@/hooks/useTasks';
import { usePlanningItems } from '@/hooks/usePlanningItems';
import { usePeople } from '@/hooks/usePeople';
import { useVendors } from '@/hooks/useVendors';
import { useEventConfiguration } from '@/hooks/useEventConfiguration';
import { useCurrentEvent } from '@/contexts/CurrentEventContext';

interface EventDataContextType {
  tasks: any[];
  planningItems: any[];
  people: any[];
  vendors: any[];
  configuration: any;
  roles: any[];
  loading: boolean;
  refreshData: () => void;
  saveConfiguration: (config: any) => Promise<void>;
  updateRole: (roleId: string, updates: any) => Promise<void>;
  addRole: (roleName: string) => Promise<void>;
  getProgressStats: () => {
    totalTasks: number;
    completedTasks: number;
    progressPercentage: number;
    criticalTasks: number;
  };
  getDaysUntilEvent: () => number;
}

const EventDataContext = createContext<EventDataContextType | undefined>(undefined);

export const EventDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentEventId } = useCurrentEvent();
  const { data: tasks = [], isLoading: tasksLoading, refetch: refetchTasks } = useTasks();
  const { planningItems } = usePlanningItems();
  const { people, loading: peopleLoading, loadPeople } = usePeople();
  const { vendors, loading: vendorsLoading, loadVendors } = useVendors();
  const { configuration, roles, saveConfiguration: saveConfig, updateRole, addRole } = useEventConfiguration(currentEventId);
  
  const [lastUpdate, setLastUpdate] = useState(Date.now());
  
  // Auto-refresh data every 30 seconds for real-time sync
  useEffect(() => {
    const interval = setInterval(() => {
      refreshData();
    }, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const loading = tasksLoading || peopleLoading || vendorsLoading;

  const refreshData = () => {
    refetchTasks();
    loadPeople();
    loadVendors();
    setLastUpdate(Date.now());
  };

  const saveConfiguration = async (config: any) => {
    await saveConfig(config);
    refreshData(); // Synchroniser avec les autres onglets
  };

  const getProgressStats = () => {
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(task => task.status === 'completed').length;
    const progressPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
    const criticalTasks = tasks.filter(task => 
      task.priority === 'high' && task.status !== 'completed'
    ).length;

    return {
      totalTasks,
      completedTasks,
      progressPercentage,
      criticalTasks
    };
  };

  const getDaysUntilEvent = () => {
    // Calcule les jours jusqu'à l'événement (exemple avec date fixe)
    const eventDate = new Date('2024-06-15'); // À adapter selon vos données
    const today = new Date();
    const diffTime = eventDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
  };

  const value = {
    tasks,
    planningItems,
    people,
    vendors,
    configuration,
    roles,
    loading,
    refreshData,
    saveConfiguration,
    updateRole,
    addRole,
    getProgressStats,
    getDaysUntilEvent
  };

  return (
    <EventDataContext.Provider value={value}>
      {children}
    </EventDataContext.Provider>
  );
};

export const useEventData = () => {
  const context = useContext(EventDataContext);
  if (context === undefined) {
    throw new Error('useEventData must be used within an EventDataProvider');
  }
  return context;
};
