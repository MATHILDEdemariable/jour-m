import { useEventData } from '@/contexts/EventDataContext';
import { useTimelineItems } from '@/hooks/useTimelineItems';
import { useCurrentEvent } from '@/contexts/CurrentEventContext';

export const useSharedEventData = () => {
  const {
    tasks,
    planningItems,
    people,
    vendors,
    loading,
    refreshData,
    getProgressStats,
    getDaysUntilEvent
  } = useEventData();

  const { timelineItems, loadTimelineItems } = useTimelineItems();
  const { currentEventId } = useCurrentEvent();

  // Nettoyage des logs : logs de debug supprimés (gardé seulement logs d’erreur lors de refreshData)
  
  const eventFilteredTasks = tasks.filter(task => task.event_id === currentEventId);
  const eventFilteredPeople = people.filter(person => person.event_id === currentEventId);
  const eventFilteredVendors = vendors.filter(vendor => vendor.event_id === currentEventId);
  const eventFilteredPlanningItems = planningItems.filter(item => item.event_id === currentEventId);

  // Enhanced refresh avec logs réduits
  const enhancedRefreshData = async () => {
    try {
      await Promise.all([
        refreshData(),
        loadTimelineItems()
      ]);
    } catch (error) {
      console.error('ENHANCED REFRESH ERROR', error);
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
    
    console.log('Timeline stats calculated:', stats);
    return stats;
  };

  const getDocumentStats = () => {
    return {
      totalDocuments: 18,
      pendingDocuments: 3,
      approvedDocuments: 15
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
