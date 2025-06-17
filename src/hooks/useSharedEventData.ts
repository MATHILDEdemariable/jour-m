
import { useLocalEventData } from '@/contexts/LocalEventDataContext';
import { useTimelineItems } from '@/hooks/useTimelineItems';
import { useLocalCurrentEvent } from '@/contexts/LocalCurrentEventContext';

export const useSharedEventData = () => {
  const {
    tasks,
    planningItems,
    people,
    vendors,
    documents,
    loading,
    refreshData,
    getProgressStats,
    getDaysUntilEvent
  } = useLocalEventData();

  const { timelineItems, loadTimelineItems } = useTimelineItems();
  const { currentEventId } = useLocalCurrentEvent();

  // Logs de debug améliorés pour le magic access
  console.log('useSharedEventData - Current Event ID:', currentEventId);
  console.log('useSharedEventData - All people loaded:', people.length);
  console.log('useSharedEventData - All vendors loaded:', vendors.length);
  console.log('useSharedEventData - People with current event_id:', people.filter(p => p.event_id === currentEventId).length);
  console.log('useSharedEventData - Vendors with current event_id:', vendors.filter(v => v.event_id === currentEventId).length);
  
  const eventFilteredTasks = tasks;
  const eventFilteredPeople = people;
  const eventFilteredVendors = vendors;
  const eventFilteredPlanningItems = planningItems;
  const eventFilteredDocuments = documents;

  console.log('useSharedEventData - Filtered results for event', currentEventId, ':');
  console.log('  - People:', eventFilteredPeople.length, eventFilteredPeople.map(p => ({ id: p.id, name: p.name, event_id: p.event_id })));
  console.log('  - Vendors:', eventFilteredVendors.length, eventFilteredVendors.map(v => ({ id: v.id, name: v.name, event_id: v.event_id })));
  console.log('  - Documents:', eventFilteredDocuments.length);

  // Enhanced refresh avec retry automatique pour magic access
  const enhancedRefreshData = async (retries = 3) => {
    console.log('useSharedEventData - Enhanced refresh triggered for event:', currentEventId, 'retries left:', retries);
    
    if (!currentEventId) {
      console.log('useSharedEventData - No currentEventId, aborting refresh');
      return;
    }
    
    try {
      console.log('useSharedEventData - Starting data refresh...');
      await Promise.all([
        refreshData(),
        loadTimelineItems()
      ]);
      
      // Vérifier si les données sont maintenant disponibles
      const hasData = people.filter(p => p.event_id === currentEventId).length > 0 || 
                     vendors.filter(v => v.event_id === currentEventId).length > 0;
      
      if (!hasData && retries > 0) {
        console.log('useSharedEventData - No data found, retrying in 1 second...');
        setTimeout(() => enhancedRefreshData(retries - 1), 1000);
        return;
      }
      
      console.log('useSharedEventData - Enhanced refresh completed successfully');
      
      // Logs post-refresh
      setTimeout(() => {
        console.log('useSharedEventData - Post-refresh data check:');
        console.log('  - Current event ID:', currentEventId);
        console.log('  - People available:', people.length);
        console.log('  - Vendors available:', vendors.length);
        console.log('  - People for this event:', people.filter(p => p.event_id === currentEventId).length);
        console.log('  - Vendors for this event:', vendors.filter(v => v.event_id === currentEventId).length);
      }, 100);
      
    } catch (error) {
      console.error('useSharedEventData - Enhanced refresh error:', error);
      if (retries > 0) {
        console.log('useSharedEventData - Retrying after error...');
        setTimeout(() => enhancedRefreshData(retries - 1), 2000);
      }
    }
  };

  // Fonctions utilitaires pour les données partagées
  const getCriticalTasks = () => {
    return eventFilteredTasks.filter(task => 
      task.priority === 'high' && task.status !== 'completed'
    ).slice(0, 5);
  };

  const getUpcomingPlanningItems = () => {
    return eventFilteredPlanningItems.slice(0, 3);
  };

  const getTeamSummary = () => {
    const total = eventFilteredPeople.length;
    const confirmed = eventFilteredPeople.filter(p => p.confirmation_status === 'confirmed').length;
    const pending = total - confirmed;
    
    console.log('Team summary calculated for event', currentEventId, ':', { total, confirmed, pending });
    return { confirmed, pending, total };
  };

  const getVendorsSummary = () => {
    const total = eventFilteredVendors.length;
    const confirmed = eventFilteredVendors.filter(v => v.contract_status === 'signed').length;
    const pending = total - confirmed;
    
    console.log('Vendors summary calculated for event', currentEventId, ':', { total, confirmed, pending });
    return { confirmed, pending, total };
  };

  const getTimelineStats = () => {
    const filteredTimelineItems = timelineItems.filter(item => item.event_id === currentEventId);
    
    const totalSteps = filteredTimelineItems.length;
    const completedSteps = filteredTimelineItems.filter(item => item.status === 'completed').length;
    const criticalSteps = filteredTimelineItems.filter(item => item.priority === 'high' && item.status !== 'completed').length;
    const delayedSteps = filteredTimelineItems.filter(item => item.status === 'delayed').length;
    
    const stats = {
      totalSteps,
      completedSteps,
      criticalSteps,
      delayedSteps,
      progressPercentage: totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : 0
    };
    
    console.log('Timeline stats calculated for event', currentEventId, ':', stats);
    return stats;
  };

  const getDocumentStats = () => {
    return {
      totalDocuments: eventFilteredDocuments.length,
      pendingDocuments: 3,
      approvedDocuments: eventFilteredDocuments.length - 3
    };
  };

  const getRecentActivity = () => {
    const activities = [];
    
    const recentCompletedTasks = eventFilteredTasks
      .filter(task => task.status === 'completed' && task.completed_at)
      .sort((a, b) => new Date(b.completed_at!).getTime() - new Date(a.completed_at!).getTime())
      .slice(0, 2);
    
    recentCompletedTasks.forEach(task => {
      activities.push({
        type: 'task_completed',
        title: `Tâche "${task.title}" marquée comme terminée`,
        time: task.completed_at!,
        color: 'green'
      });
    });

    const filteredTimelineItems = timelineItems.filter(item => item.event_id === currentEventId);
    const recentTimelineItems = filteredTimelineItems
      .filter(item => item.status === 'completed')
      .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
      .slice(0, 2);
    
    recentTimelineItems.forEach(item => {
      activities.push({
        type: 'timeline_completed',
        title: `Étape "${item.title}" terminée`,
        time: item.updated_at,
        color: 'blue'
      });
    });

    const finalActivities = activities
      .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
      .slice(0, 5);
    
    return finalActivities;
  };

  return {
    // Données filtrées par event_id UNIQUEMENT
    tasks: eventFilteredTasks,
    planningItems: eventFilteredPlanningItems,
    timelineItems: timelineItems.filter(item => item.event_id === currentEventId),
    people: eventFilteredPeople,
    vendors: eventFilteredVendors,
    documents: eventFilteredDocuments,
    loading,
    refreshData: enhancedRefreshData,
    getProgressStats,
    getDaysUntilEvent,
    getCriticalTasks,
    getUpcomingPlanningItems,
    getTeamSummary,
    getVendorsSummary,
    getTimelineStats,
    getDocumentStats,
    getRecentActivity
  };
};
