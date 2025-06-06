
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
  
  const [planningItems, setPlanningItems] = useState<PlanningItem[]>([
    {
      id: 1,
      time: "08:00",
      duration: 120,
      title: "Préparation mariée",
      description: "Coiffure, maquillage, habillage",
      category: "Préparation",
      status: "scheduled",
      assignedTo: ["bride", "maid-of-honor"]
    },
    {
      id: 2,
      time: "10:00",
      duration: 60,
      title: "Préparation marié",
      description: "Habillage et préparatifs",
      category: "Préparation", 
      status: "scheduled",
      assignedTo: ["groom", "best-man"]
    },
    {
      id: 3,
      time: "11:30",
      duration: 90,
      title: "Décoration salle",
      description: "Installation des décorations et vérifications",
      category: "Logistique",
      status: "scheduled",
      assignedTo: ["wedding-planner", "photographer"]
    },
    {
      id: 4,
      time: "14:00",
      duration: 30,
      title: "Cérémonie civile",
      description: "Échange des vœux en mairie",
      category: "Cérémonie",
      status: "scheduled",
      assignedTo: ["bride", "groom"]
    },
    {
      id: 5,
      time: "16:00",
      duration: 60,
      title: "Séance photos",
      description: "Photos de couple et de famille",
      category: "Photos",
      status: "scheduled",
      assignedTo: ["photographer"]
    },
    {
      id: 6,
      time: "19:00",
      duration: 180,
      title: "Réception",
      description: "Cocktail, dîner et soirée dansante",
      category: "Réception",
      status: "scheduled",
      assignedTo: ["caterer", "photographer"]
    }
  ]);

  const addPlanningItem = (newItem: Omit<PlanningItem, 'id' | 'time'>) => {
    const id = Math.max(...planningItems.map(item => item.id)) + 1;
    
    setPlanningItems(prev => {
      const newItems = [...prev, { ...newItem, id, time: "00:00" }];
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
      
      return recalculateTimeline(updated);
    });
    
    toast({
      title: 'Succès',
      description: 'Élément mis à jour avec succès',
    });
  };

  const reorderItems = (sourceIndex: number, destinationIndex: number) => {
    setPlanningItems(prev => {
      const items = [...prev];
      const [removed] = items.splice(sourceIndex, 1);
      items.splice(destinationIndex, 0, removed);
      
      return recalculateTimeline(items);
    });
    
    toast({
      title: 'Planning réorganisé',
      description: 'L\'ordre a été modifié et les horaires recalculés',
    });
  };

  const recalculateTimeline = (items: PlanningItem[]): PlanningItem[] => {
    if (items.length === 0) return items;

    const sorted = [...items].sort((a, b) => {
      if (a.id === b.id) return 0;
      const indexA = items.findIndex(item => item.id === a.id);
      const indexB = items.findIndex(item => item.id === b.id);
      return indexA - indexB;
    });

    let currentTime = timeToMinutes("08:00"); // Heure de début par défaut
    
    return sorted.map((item, index) => {
      const newTime = minutesToTime(currentTime);
      currentTime += item.duration;
      
      return {
        ...item,
        time: newTime
      };
    });
  };

  const timeToMinutes = (time: string): number => {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  };

  const minutesToTime = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
  };

  const calculateEndTime = (startTime: string, duration: number): string => {
    const startMinutes = timeToMinutes(startTime);
    return minutesToTime(startMinutes + duration);
  };

  const getTotalDuration = () => {
    return planningItems.reduce((total, item) => total + item.duration, 0);
  };

  const getEndTime = () => {
    if (planningItems.length === 0) return "08:00";
    const lastItem = planningItems[planningItems.length - 1];
    return calculateEndTime(lastItem.time, lastItem.duration);
  };

  return {
    planningItems,
    addPlanningItem,
    deletePlanningItem,
    updatePlanningItem,
    reorderItems,
    recalculateTimeline,
    calculateEndTime,
    getTotalDuration,
    getEndTime
  };
};
