
import { useEventData } from '@/contexts/EventDataContext';
import { useTimelineItems } from '@/hooks/useTimelineItems';

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

  const { timelineItems } = useTimelineItems();

  // Debug: Log pour vérifier la cohérence des données
  console.log('useSharedEventData - Data check:');
  console.log('Tasks from EventDataContext:', tasks);
  console.log('People from EventDataContext:', people);
  console.log('Vendors from EventDataContext:', vendors);
  console.log('Timeline items from useTimelineItems:', timelineItems);
  console.log('Loading state:', loading);

  // Fonctions utilitaires pour les données partagées
  const getCriticalTasks = () => {
    return tasks.filter(task => 
      task.priority === 'high' && task.status !== 'completed'
    ).slice(0, 5); // Top 5 tâches critiques
  };

  const getUpcomingPlanningItems = () => {
    return planningItems.slice(0, 3); // Prochaines 3 étapes
  };

  const getTeamSummary = () => {
    const confirmed = people.filter(p => p.confirmation_status === 'confirmed').length;
    const pending = people.filter(p => p.confirmation_status === 'pending').length;
    const total = people.length;
    
    console.log('Team summary:', { confirmed, pending, total });
    return { confirmed, pending, total };
  };

  const getVendorsSummary = () => {
    const confirmed = vendors.filter(v => v.contract_status === 'signed').length;
    const pending = vendors.filter(v => v.contract_status === 'quote').length;
    const total = vendors.length;
    
    console.log('Vendors summary:', { confirmed, pending, total });
    return { confirmed, pending, total };
  };

  const getTimelineStats = () => {
    const totalSteps = timelineItems.length;
    const completedSteps = timelineItems.filter(item => item.status === 'completed').length;
    const criticalSteps = timelineItems.filter(item => item.priority === 'high' && item.status !== 'completed').length;
    const delayedSteps = timelineItems.filter(item => item.status === 'delayed').length;
    
    const stats = {
      totalSteps,
      completedSteps,
      criticalSteps,
      delayedSteps,
      progressPercentage: totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : 0
    };
    
    console.log('Timeline stats:', stats);
    return stats;
  };

  const getDocumentStats = () => {
    // Pour l'instant, on simule les stats des documents
    // Plus tard, cela sera connecté aux vrais documents
    return {
      totalDocuments: 18,
      pendingDocuments: 3,
      approvedDocuments: 15
    };
  };

  const getRecentActivity = () => {
    const activities = [];
    
    // Activités récentes des tâches terminées
    const recentCompletedTasks = tasks
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

    // Activités récentes des timeline items
    const recentTimelineItems = timelineItems
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
    
    console.log('Recent activities:', finalActivities);
    return finalActivities;
  };

  return {
    // Données brutes - EXACTEMENT les mêmes que l'Admin Portal
    tasks,
    planningItems,
    timelineItems,
    people,
    vendors,
    loading,
    
    // Actions
    refreshData,
    
    // Statistiques et calculs
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
