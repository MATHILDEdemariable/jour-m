
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useEventStore } from '@/stores/eventStore';
import { useLocalCurrentEvent } from '@/contexts/LocalCurrentEventContext';

interface EventDataContextType {
  tasks: any[];
  planningItems: any[];
  timelineItems: any[]; // Ajout de timelineItems
  people: any[];
  vendors: any[];
  documents: any[];
  currentEvent: any;
  events: any[];
  loading: boolean;
  refreshData: () => void;
  updateEvent: (id: string, updates: any) => void;
  getProgressStats: () => {
    totalTasks: number;
    completedTasks: number;
    progressPercentage: number;
    criticalTasks: number;
  };
  getDaysUntilEvent: () => number;
  getDocumentStats: () => {
    totalDocuments: number;
    totalSize: number;
    categoriesCount: number;
    googleDriveCount: number;
    manualCount: number;
  };
}

const LocalEventDataContext = createContext<EventDataContextType | undefined>(undefined);

export const LocalEventDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentEventId } = useLocalCurrentEvent();
  const {
    tasks,
    planningItems,
    timelineItems, // Ajout de timelineItems depuis le store
    people,
    vendors,
    documents,
    events,
    loading,
    refreshData,
    updateEvent
  } = useEventStore();

  const [lastUpdate, setLastUpdate] = useState(Date.now());

  // Enhanced refresh function
  const enhancedRefreshData = async () => {
    console.log('LocalEventDataContext - Enhanced refresh triggered for event:', currentEventId);
    refreshData();
    setLastUpdate(Date.now());
  };

  // Force refresh when event changes
  useEffect(() => {
    if (currentEventId) {
      console.log('LocalEventDataContext - Event changed, forcing refresh for:', currentEventId);
      enhancedRefreshData();
    }
  }, [currentEventId]);

  // Filter data by current event
  const eventFilteredTasks = tasks.filter(task => task.event_id === currentEventId);
  const eventFilteredPeople = people.filter(person => person.event_id === currentEventId);
  const eventFilteredVendors = vendors.filter(vendor => vendor.event_id === currentEventId);
  const eventFilteredPlanningItems = planningItems.filter(item => item.event_id === currentEventId);
  const eventFilteredTimelineItems = timelineItems.filter(item => item.event_id === currentEventId); // Filtrage des timeline items
  const eventFilteredDocuments = documents.filter(doc => doc.event_id === currentEventId);
  const currentEvent = events.find(event => event.id === currentEventId);

  const getProgressStats = () => {
    const totalTasks = eventFilteredTasks.length;
    const completedTasks = eventFilteredTasks.filter(task => task.status === 'completed').length;
    const progressPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
    const criticalTasks = eventFilteredTasks.filter(task => 
      task.priority === 'high' && task.status !== 'completed'
    ).length;

    return {
      totalTasks,
      completedTasks,
      progressPercentage,
      criticalTasks
    };
  };

  const getDocumentStats = () => {
    const totalSize = eventFilteredDocuments.reduce((sum, doc) => sum + (doc.file_size || 0), 0);
    const categories = [...new Set(eventFilteredDocuments.map(doc => doc.category).filter(Boolean))];
    const googleDriveCount = eventFilteredDocuments.filter(doc => doc.source === 'google_drive').length;
    const manualCount = eventFilteredDocuments.filter(doc => doc.source === 'manual').length;

    return {
      totalDocuments: eventFilteredDocuments.length,
      totalSize,
      categoriesCount: categories.length,
      googleDriveCount,
      manualCount
    };
  };

  const getDaysUntilEvent = () => {
    if (!currentEvent?.event_date) return 0;
    
    const eventDate = new Date(currentEvent.event_date);
    const today = new Date();
    const diffTime = eventDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
  };

  const value = {
    tasks: eventFilteredTasks,
    planningItems: eventFilteredPlanningItems,
    timelineItems: eventFilteredTimelineItems, // Ajout de timelineItems dans la valeur retournée
    people: eventFilteredPeople,
    vendors: eventFilteredVendors,
    documents: eventFilteredDocuments,
    currentEvent,
    events,
    loading,
    refreshData: enhancedRefreshData,
    updateEvent,
    getProgressStats,
    getDocumentStats,
    getDaysUntilEvent
  };

  return (
    <LocalEventDataContext.Provider value={value}>
      {children}
    </LocalEventDataContext.Provider>
  );
};

export const useLocalEventData = () => {
  const context = useContext(LocalEventDataContext);
  if (context === undefined) {
    throw new Error('useLocalEventData must be used within a LocalEventDataProvider');
  }
  return context;
};
