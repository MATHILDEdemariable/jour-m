
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

  const updatePlanningItem = (id: number, updates: Partial<PlanningItem>) => {
    setPlanningItems(prev => {
      const updated = prev.map(item => 
        item.id === id ? { ...item, ...updates } : item
      );
      
      // Recalculer les horaires si nécessaire
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
      
      // Recalculer les horaires après réorganisation
      return recalculateTimeline(items);
    });
    
    toast({
      title: 'Planning mis à jour',
      description: 'L\'ordre a été modifié et les horaires recalculés',
    });
  };

  const recalculateTimeline = (items: PlanningItem[]): PlanningItem[] => {
    const sorted = [...items].sort((a, b) => {
      const timeA = timeToMinutes(a.time);
      const timeB = timeToMinutes(b.time);
      return timeA - timeB;
    });

    let currentTime = timeToMinutes(sorted[0]?.time || "08:00");
    
    return sorted.map((item, index) => {
      if (index === 0) {
        return item;
      }
      
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

  return {
    planningItems,
    updatePlanningItem,
    reorderItems,
    recalculateTimeline
  };
};
