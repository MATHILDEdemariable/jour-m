
import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import { useEventStore } from '@/stores/eventStore';
import { useLocalCurrentEvent } from '@/contexts/LocalCurrentEventContext';

interface EventDataContextType {
  tasks: any[];
  planningItems: any[];
  timelineItems: any[];
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
    timelineItems,
    people,
    vendors,
    documents,
    events,
    loading,
    refreshData: storeRefreshData,
    updateEvent
  } = useEventStore();

  // Use ref to prevent recreating the refresh function
  const refreshInProgress = useRef(false);

  // Stabilize the refresh function with useCallback
  const enhancedRefreshData = useCallback(async () => {
    if (refreshInProgress.current) {
      console.log('LocalEventDataContext - Refresh already in progress, skipping');
      return;
    }

    refreshInProgress.current = true;
    console.log('LocalEventDataContext - Enhanced refresh triggered for event:', currentEventId);
    
    try {
      await storeRefreshData();
      console.log('LocalEventDataContext - Refresh completed for event:', currentEventId);
    } catch (error) {
      console.error('LocalEventDataContext - Refresh error:', error);
    } finally {
      refreshInProgress.current = false;
    }
  }, [storeRefreshData, currentEventId]);

  // Force refresh when event changes - but only once per event change
  useEffect(() => {
    if (currentEventId && !refreshInProgress.current) {
      console.log('LocalEventDataContext - Event changed, triggering refresh for:', currentEventId);
      enhancedRefreshData();
    }
  }, [currentEventId, enhancedRefreshData]);

  // Auto-refresh every 30 seconds - stabilized with useCallback
  useEffect(() => {
    const interval = setInterval(() => {
      if (!refreshInProgress.current) {
        console.log('LocalEventDataContext - Auto-refresh triggered');
        enhancedRefreshData();
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [enhancedRefreshData]);

  // Filter data by current event with proper fallback
  const safeCurrentEventId = currentEventId || 'default-event';
  
  const eventFilteredTasks = tasks.filter(task => 
    task.event_id === safeCurrentEventId || 
    (!task.event_id && safeCurrentEventId === 'default-event')
  );
  
  const eventFilteredPeople = people.filter(person => 
    person.event_id === safeCurrentEventId || 
    (!person.event_id && safeCurrentEventId === 'default-event')
  );
  
  const eventFilteredVendors = vendors.filter(vendor => 
    vendor.event_id === safeCurrentEventId || 
    (!vendor.event_id && safeCurrentEventId === 'default-event')
  );
  
  const eventFilteredPlanningItems = planningItems.filter(item => 
    item.event_id === safeCurrentEventId || 
    (!item.event_id && safeCurrentEventId === 'default-event')
  );
  
  const eventFilteredTimelineItems = timelineItems.filter(item => 
    item.event_id === safeCurrentEventId || 
    (!item.event_id && safeCurrentEventId === 'default-event')
  );
  
  const eventFilteredDocuments = documents.filter(doc => 
    doc.event_id === safeCurrentEventId || 
    (!doc.event_id && safeCurrentEventId === 'default-event')
  );
  
  const currentEvent = events.find(event => event.id === safeCurrentEventId);

  const getProgressStats = useCallback(() => {
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
  }, [eventFilteredTasks]);

  const getDocumentStats = useCallback(() => {
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
  }, [eventFilteredDocuments]);

  const getDaysUntilEvent = useCallback(() => {
    if (!currentEvent?.event_date) return 0;
    
    const eventDate = new Date(currentEvent.event_date);
    const today = new Date();
    const diffTime = eventDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
  }, [currentEvent?.event_date]);

  // Memoize the context value to prevent unnecessary re-renders
  const value = React.useMemo(() => ({
    tasks: eventFilteredTasks,
    planningItems: eventFilteredPlanningItems,
    timelineItems: eventFilteredTimelineItems,
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
  }), [
    eventFilteredTasks,
    eventFilteredPlanningItems,
    eventFilteredTimelineItems,
    eventFilteredPeople,
    eventFilteredVendors,
    eventFilteredDocuments,
    currentEvent,
    events,
    loading,
    enhancedRefreshData,
    updateEvent,
    getProgressStats,
    getDocumentStats,
    getDaysUntilEvent
  ]);

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
