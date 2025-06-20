
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useCurrentEvent } from '@/contexts/CurrentEventContext';

interface EventDataContextType {
  tasks: any[];
  timelineItems: any[];
  people: any[];
  vendors: any[];
  documents: any[];
  currentEvent: any;
  events: any[];
  loading: boolean;
  refreshData: () => void;
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

const EventDataContext = createContext<EventDataContextType | undefined>(undefined);

export const EventDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentTenantId } = useAuth();
  const { currentEventId } = useCurrentEvent();

  // Fetch tasks
  const { data: tasks = [], isLoading: tasksLoading, refetch: refetchTasks } = useQuery({
    queryKey: ['tasks', currentTenantId, currentEventId],
    queryFn: async () => {
      if (!currentTenantId) return [];
      const query = supabase
        .from('tasks')
        .select('*')
        .eq('tenant_id', currentTenantId);
      
      if (currentEventId) {
        query.eq('event_id', currentEventId);
      }
      
      const { data, error } = await query.order('created_at', { ascending: false });
      if (error) throw error;
      return data || [];
    },
    enabled: !!currentTenantId,
  });

  // Fetch timeline items
  const { data: timelineItems = [], isLoading: timelineLoading, refetch: refetchTimeline } = useQuery({
    queryKey: ['timeline_items', currentTenantId, currentEventId],
    queryFn: async () => {
      if (!currentTenantId || !currentEventId) return [];
      const { data, error } = await supabase
        .from('timeline_items')
        .select('*')
        .eq('tenant_id', currentTenantId)
        .eq('event_id', currentEventId)
        .order('time', { ascending: true });
      if (error) throw error;
      return data || [];
    },
    enabled: !!(currentTenantId && currentEventId),
  });

  // Fetch people
  const { data: people = [], isLoading: peopleLoading, refetch: refetchPeople } = useQuery({
    queryKey: ['people', currentTenantId, currentEventId],
    queryFn: async () => {
      if (!currentTenantId) return [];
      const query = supabase
        .from('people')
        .select('*')
        .eq('tenant_id', currentTenantId);
      
      if (currentEventId) {
        query.eq('event_id', currentEventId);
      }
      
      const { data, error } = await query.order('created_at', { ascending: false });
      if (error) throw error;
      return data || [];
    },
    enabled: !!currentTenantId,
  });

  // Fetch vendors
  const { data: vendors = [], isLoading: vendorsLoading, refetch: refetchVendors } = useQuery({
    queryKey: ['vendors', currentTenantId, currentEventId],
    queryFn: async () => {
      if (!currentTenantId) return [];
      const query = supabase
        .from('vendors')
        .select('*')
        .eq('tenant_id', currentTenantId);
      
      if (currentEventId) {
        query.eq('event_id', currentEventId);
      }
      
      const { data, error } = await query.order('created_at', { ascending: false });
      if (error) throw error;
      return data || [];
    },
    enabled: !!currentTenantId,
  });

  // Fetch documents
  const { data: documents = [], isLoading: documentsLoading, refetch: refetchDocuments } = useQuery({
    queryKey: ['documents', currentTenantId, currentEventId],
    queryFn: async () => {
      if (!currentTenantId) return [];
      const query = supabase
        .from('documents')
        .select('*')
        .eq('tenant_id', currentTenantId);
      
      if (currentEventId) {
        query.eq('event_id', currentEventId);
      }
      
      const { data, error } = await query.order('created_at', { ascending: false });
      if (error) throw error;
      return data || [];
    },
    enabled: !!currentTenantId,
  });

  // Fetch events
  const { data: events = [], isLoading: eventsLoading, refetch: refetchEvents } = useQuery({
    queryKey: ['events', currentTenantId],
    queryFn: async () => {
      if (!currentTenantId) return [];
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('tenant_id', currentTenantId)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data || [];
    },
    enabled: !!currentTenantId,
  });

  // Get current event
  const currentEvent = events.find(event => event.id === currentEventId) || null;

  const loading = tasksLoading || timelineLoading || peopleLoading || vendorsLoading || documentsLoading || eventsLoading;

  const refreshData = async () => {
    console.log('EventDataContext - Refreshing all data');
    await Promise.all([
      refetchTasks(),
      refetchTimeline(),
      refetchPeople(),
      refetchVendors(),
      refetchDocuments(),
      refetchEvents()
    ]);
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

  const getDocumentStats = () => {
    const totalDocuments = documents.length;
    const totalSize = documents.reduce((sum, doc) => sum + (doc.file_size || 0), 0);
    const categories = new Set(documents.map(doc => doc.category).filter(Boolean));
    const categoriesCount = categories.size;
    const googleDriveCount = documents.filter(doc => doc.source === 'google_drive').length;
    const manualCount = documents.filter(doc => doc.source === 'manual').length;

    return {
      totalDocuments,
      totalSize,
      categoriesCount,
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
    tasks,
    timelineItems,
    people,
    vendors,
    documents,
    currentEvent,
    events,
    loading,
    refreshData,
    getProgressStats,
    getDocumentStats,
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
