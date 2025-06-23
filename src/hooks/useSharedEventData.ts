
import { useLocalEventData } from '@/contexts/LocalEventDataContext';
import { useTimelineItems } from '@/hooks/useTimelineItems';
import { useLocalCurrentEvent } from '@/contexts/LocalCurrentEventContext';
import { useEvents } from '@/hooks/useEvents';
import { useVendors } from '@/hooks/useVendors';
import { usePeople } from '@/hooks/usePeople';

export const useSharedEventData = () => {
  // Utiliser les hooks Supabase pour les données réelles
  const { events, currentEvent, loading: eventsLoading } = useEvents();
  const { vendors, loading: vendorsLoading } = useVendors();
  const { people, loading: peopleLoading } = usePeople();
  
  // Utiliser les données locales pour les tâches et documents
  const {
    tasks,
    planningItems,
    documents,
    loading: localLoading,
    refreshData,
    getProgressStats,
    getDaysUntilEvent
  } = useLocalEventData();

  const { timelineItems, loadTimelineItems } = useTimelineItems();
  const { currentEventId } = useLocalCurrentEvent();

  // Calculer le state de loading global
  const loading = eventsLoading || vendorsLoading || peopleLoading || localLoading;

  // Logs de debug améliorés
  console.log('useSharedEventData - Current Event ID:', currentEventId);
  console.log('useSharedEventData - Current Event:', currentEvent);
  console.log('useSharedEventData - People loaded:', people.length);
  console.log('useSharedEventData - Vendors loaded:', vendors.length);
  
  // Filtrer les données par event_id
  const eventFilteredTasks = tasks.filter(task => task.event_id === currentEventId);
  const eventFilteredPeople = people.filter(person => person.event_id === currentEventId);
  const eventFilteredVendors = vendors.filter(vendor => vendor.event_id === currentEventId);
  const eventFilteredPlanningItems = planningItems.filter(item => item.event_id === currentEventId);
  const eventFilteredDocuments = documents.filter(doc => doc.event_id === currentEventId);
  const eventFilteredTimelineItems = timelineItems.filter(item => item.event_id === currentEventId);

  console.log('useSharedEventData - Filtered results for event', currentEventId, ':');
  console.log('  - People:', eventFilteredPeople.length);
  console.log('  - Vendors:', eventFilteredVendors.length);
  console.log('  - Tasks:', eventFilteredTasks.length);
  console.log('  - Documents:', eventFilteredDocuments.length);

  // Enhanced refresh avec retry automatique
  const enhancedRefreshData = async (retries = 3) => {
    console.log('useSharedEventData - Enhanced refresh triggered');
    
    try {
      await Promise.all([
        refreshData(),
        loadTimelineItems()
      ]);
      
      console.log('useSharedEventData - Enhanced refresh completed successfully');
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
    
    console.log('Team summary calculated:', { total, confirmed, pending });
    return { confirmed, pending, total };
  };

  const getVendorsSummary = () => {
    const total = eventFilteredVendors.length;
    const confirmed = eventFilteredVendors.filter(v => v.contract_status === 'signed').length;
    const pending = total - confirmed;
    
    console.log('Vendors summary calculated:', { total, confirmed, pending });
    return { confirmed, pending, total };
  };

  const getTimelineStats = () => {
    const totalSteps = eventFilteredTimelineItems.length;
    const completedSteps = eventFilteredTimelineItems.filter(item => item.status === 'completed').length;
    const criticalSteps = eventFilteredTimelineItems.filter(item => item.priority === 'high' && item.status !== 'completed').length;
    const delayedSteps = eventFilteredTimelineItems.filter(item => item.status === 'delayed').length;
    
    const stats = {
      totalSteps,
      completedSteps,
      criticalSteps,
      delayedSteps,
      progressPercentage: totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : 0
    };
    
    console.log('Timeline stats calculated:', stats);
    return stats;
  };

  const getDocumentStats = () => {
    return {
      totalDocuments: eventFilteredDocuments.length,
      pendingDocuments: eventFilteredDocuments.filter(doc => doc.category === 'pending').length,
      approvedDocuments: eventFilteredDocuments.filter(doc => doc.category === 'approved').length
    };
  };

  const getRecentActivity = () => {
    const activities = [];
    
    const recentCompletedTasks = eventFilteredTasks
      .filter(task => task.status === 'completed' && task.completed_at)
      .sort((a, b) => new Date(b.completed_at!).getTime() - new Date(a.completed_at!).getTime())
      .slice(0, 3);
    
    recentCompletedTasks.forEach(task => {
      activities.push({
        type: 'task_completed',
        title: `Tâche "${task.title}" marquée comme terminée`,
        time: task.completed_at!,
        color: 'green'
      });
    });

    const recentTimelineItems = eventFilteredTimelineItems
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

    return activities
      .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
      .slice(0, 5);
  };

  return {
    // Données filtrées par event_id
    tasks: eventFilteredTasks,
    planningItems: eventFilteredPlanningItems,
    timelineItems: eventFilteredTimelineItems,
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
