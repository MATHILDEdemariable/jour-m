
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

export interface PlanningItem {
  id: number;
  time: string;
  duration: number;
  title: string;
  description: string;
  category: string;
  status: string;
  assignedTo: string[];
  isCustom?: boolean;
}

export const usePlanningItems = () => {
  const { toast } = useToast();
  
  // Retourner un array vide par défaut - les données viendront uniquement de l'Admin Portal
  const [planningItems, setPlanningItems] = useState<PlanningItem[]>([]);

  const addPlanningItem = (newItem: Omit<PlanningItem, 'id'>) => {
    const id = Math.max(...planningItems.map(item => item.id), 0) + 1;
    
    setPlanningItems(prev => {
      const newItems = [...prev, { ...newItem, id }];
      return recalculateTimeline(newItems);
    });
    
    toast({
      title: 'Étape ajoutée',
      description: 'Nouvelle étape ajoutée au planning avec succès',
    });
  };

  const deletePlanningItem = (id: number) => {
    setPlanningItems(prev => {
      const filtered = prev.filter(item => item.id !== id);
      return recalculateTimeline(filtered);
    });
    
    toast({
      title: 'Étape supprimée',
      description: 'L\'étape a été supprimée du planning',
    });
  };

  const updatePlanningItem = (id: number, updates: Partial<PlanningItem>) => {
    setPlanningItems(prev => {
      const updated = prev.map(item => 
        item.id === id ? { ...item, ...updates } : item
      );
      
      if (updates.time) {
        return recalculateTimelineFromItem(updated, id);
      }
      
      return recalculateTimeline(updated);
    });
    
    toast({
      title: 'Succès',
      description: 'Élément mis à jour avec succès',
    });
  };

  const reorderItems = (fromIndex: number, toIndex: number) => {
    setPlanningItems(prev => {
      const items = [...prev];
      const [removed] = items.splice(fromIndex, 1);
      items.splice(toIndex, 0, removed);
      return recalculateTimeline(items);
    });
  };

  // Helper functions
  const recalculateTimeline = (items: PlanningItem[]): PlanningItem[] => {
    let currentTime = 8 * 60; // Start at 8:00 AM (in minutes)
    
    return items.map(item => {
      const time = `${Math.floor(currentTime / 60).toString().padStart(2, '0')}:${(currentTime % 60).toString().padStart(2, '0')}`;
      currentTime += item.duration;
      
      return {
        ...item,
        time
      };
    });
  };

  const recalculateTimelineFromItem = (items: PlanningItem[], fromId: number): PlanningItem[] => {
    const fromIndex = items.findIndex(item => item.id === fromId);
    if (fromIndex === -1) return items;
    
    const fromItem = items[fromIndex];
    const [hours, minutes] = fromItem.time.split(':').map(Number);
    let currentTime = hours * 60 + minutes + fromItem.duration;
    
    return items.map((item, index) => {
      if (index <= fromIndex) return item;
      
      const time = `${Math.floor(currentTime / 60).toString().padStart(2, '0')}:${(currentTime % 60).toString().padStart(2, '0')}`;
      currentTime += item.duration;
      
      return {
        ...item,
        time
      };
    });
  };

  const calculateEndTime = (startTime: string, duration: number): string => {
    const [hours, minutes] = startTime.split(':').map(Number);
    const totalMinutes = hours * 60 + minutes + duration;
    const endHours = Math.floor(totalMinutes / 60);
    const endMins = totalMinutes % 60;
    return `${endHours.toString().padStart(2, '0')}:${endMins.toString().padStart(2, '0')}`;
  };

  const getTotalDuration = (): number => {
    return planningItems.reduce((total, item) => total + item.duration, 0);
  };

  const getEndTime = (): string => {
    if (planningItems.length === 0) return '08:00';
    const lastItem = planningItems[planningItems.length - 1];
    return calculateEndTime(lastItem.time, lastItem.duration);
  };

  return {
    planningItems,
    addPlanningItem,
    deletePlanningItem,
    updatePlanningItem,
    reorderItems,
    calculateEndTime,
    getTotalDuration,
    getEndTime
  };
};
