
import { useEventData } from '@/contexts/EventDataContext';

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
    const confirmed = people.filter(p => p.status === 'confirmed').length;
    const pending = people.filter(p => p.status === 'pending').length;
    const total = people.length;
    
    return { confirmed, pending, total };
  };

  const getVendorsSummary = () => {
    const confirmed = vendors.filter(v => v.contract_status === 'signed').length;
    const pending = vendors.filter(v => v.contract_status === 'quote').length;
    const total = vendors.length;
    
    return { confirmed, pending, total };
  };

  return {
    // Données brutes
    tasks,
    planningItems,
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
    getVendorsSummary
  };
};
