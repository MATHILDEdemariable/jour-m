
import { useState } from 'react';
import { useEventStore } from '@/stores/eventStore';
import type { TimelineItem } from '@/stores/eventStore';

// Hook qui remplace useTimelineItems en gardant exactement la même interface
export const useLocalTimelineItems = () => {
  const {
    timelineItems,
    currentEventId,
    addTimelineItem: addTimelineItemToStore,
    updateTimelineItem: updateTimelineItemInStore,
    deleteTimelineItem: deleteTimelineItemFromStore,
    loading
  } = useEventStore();

  const [localLoading, setLocalLoading] = useState(false);

  const generateId = () => `timeline-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  const loadTimelineItems = async () => {
    setLocalLoading(true);
    await new Promise(resolve => setTimeout(resolve, 100));
    setLocalLoading(false);
    console.log('useLocalTimelineItems - Timeline items loaded from localStorage');
  };

  const addTimelineItem = async (item: Omit<TimelineItem, 'id' | 'event_id' | 'created_at' | 'updated_at' | 'assigned_person_id'>) => {
    try {
      const timelineItem: TimelineItem = {
        ...item,
        id: generateId(),
        event_id: currentEventId,
        assigned_person_id: null, // Pour compatibilité
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      addTimelineItemToStore(timelineItem);
      console.log('useLocalTimelineItems - Timeline item added:', timelineItem);
    } catch (error) {
      console.error('Error adding timeline item:', error);
      throw error;
    }
  };

  const updateTimelineItem = async (id: string, updates: Partial<TimelineItem>) => {
    try {
      const updatedData = {
        ...updates,
        updated_at: new Date().toISOString()
      };
      updateTimelineItemInStore(id, updatedData);
      console.log('useLocalTimelineItems - Timeline item updated:', id);
    } catch (error) {
      console.error('Error updating timeline item:', error);
      throw error;
    }
  };

  const deleteTimelineItem = async (id: string) => {
    try {
      deleteTimelineItemFromStore(id);
      console.log('useLocalTimelineItems - Timeline item deleted:', id);
    } catch (error) {
      console.error('Error deleting timeline item:', error);
      throw error;
    }
  };

  const reorderItems = async (fromIndex: number, toIndex: number) => {
    // Get current items filtered by event
    const currentItems = timelineItems.filter(item => item.event_id === currentEventId);
    const newItems = [...currentItems];
    const [removed] = newItems.splice(fromIndex, 1);
    newItems.splice(toIndex, 0, removed);

    // Recalculate times and order
    let currentTime = newItems.length > 0 ? newItems[0].time : '08:00';
    
    const updatedItems = newItems.map((item, index) => {
      if (index === 0) {
        return { ...item, order_index: index };
      } else {
        const prevItem = newItems[index - 1];
        const startTime = calculateEndTime(currentTime, prevItem.duration);
        currentTime = startTime;
        return { ...item, time: startTime, order_index: index };
      }
    });

    // Update all items
    for (const item of updatedItems) {
      await updateTimelineItem(item.id, { 
        order_index: item.order_index,
        time: item.time
      });
    }

    console.log('useLocalTimelineItems - Items reordered with time recalculation');
  };

  const calculateEndTime = (startTime: string, duration: number) => {
    const timeWithoutSeconds = startTime.substring(0, 5);
    const [hours, minutes] = timeWithoutSeconds.split(':').map(Number);
    const totalMinutes = hours * 60 + minutes + duration;
    const endHours = Math.floor(totalMinutes / 60);
    const endMins = totalMinutes % 60;
    return `${endHours.toString().padStart(2, '0')}:${endMins.toString().padStart(2, '0')}`;
  };

  const getTotalDuration = () => {
    const filteredItems = timelineItems.filter(item => item.event_id === currentEventId);
    return filteredItems.reduce((total, item) => total + item.duration, 0);
  };

  const getEndTime = () => {
    const filteredItems = timelineItems.filter(item => item.event_id === currentEventId);
    if (filteredItems.length === 0) return '08:00';
    const lastItem = filteredItems[filteredItems.length - 1];
    return calculateEndTime(lastItem.time, lastItem.duration);
  };

  return {
    timelineItems: timelineItems.filter(item => item.event_id === currentEventId),
    loading: loading || localLoading,
    loadTimelineItems,
    addTimelineItem,
    updateTimelineItem,
    deleteTimelineItem,
    reorderItems,
    calculateEndTime,
    getTotalDuration,
    getEndTime,
  };
};
