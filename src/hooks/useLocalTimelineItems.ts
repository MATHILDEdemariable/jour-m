import { useState, useEffect } from 'react';
import { useEventStore } from '@/stores/eventStore';
import type { TimelineItem } from '@/stores/eventStore';

// Hook qui remplace useTimelineItems en gardant exactement la même interface
export const useLocalTimelineItems = () => {
  const { 
    timelineItems, 
    addTimelineItem: storeAddTimelineItem,
    updateTimelineItem: storeUpdateTimelineItem,
    deleteTimelineItem: storeDeleteTimelineItem,
    reorderTimelineItems,
    currentEventId,
    loading
  } = useEventStore();

  const [localLoading, setLocalLoading] = useState(false);

  // Filter timeline items by current event
  const currentEventTimelineItems = timelineItems.filter(
    item => item.event_id === (currentEventId || localStorage.getItem('currentEventId') || 'default-event')
  );

  const addTimelineItem = async (itemData: Partial<TimelineItem>) => {
    setLocalLoading(true);
    try {
      const newItem: TimelineItem = {
        id: crypto.randomUUID(),
        event_id: currentEventId || localStorage.getItem('currentEventId') || 'default-event',
        title: itemData.title || '',
        description: itemData.description || null,
        time: itemData.time || '08:00',
        duration: itemData.duration || 60,
        category: itemData.category || 'Préparation',
        status: itemData.status || 'scheduled',
        priority: itemData.priority || 'medium',
        assigned_person_ids: itemData.assigned_person_ids || [],
        assigned_vendor_ids: itemData.assigned_vendor_ids || [],
        assigned_person_id: null, // Added for compatibility
        assigned_vendor_id: null, // Added for compatibility
        assigned_role: itemData.assigned_role || null,
        order_index: itemData.order_index || currentEventTimelineItems.length,
        notes: itemData.notes || null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      storeAddTimelineItem(newItem);
    } finally {
      setLocalLoading(false);
    }
  };

  const updateTimelineItem = async (id: string, updates: Partial<TimelineItem>) => {
    try {
      const updatedData = {
        ...updates,
        updated_at: new Date().toISOString()
      };
      storeUpdateTimelineItem(id, updatedData);
      console.log('useLocalTimelineItems - Timeline item updated:', id);
    } catch (error) {
      console.error('Error updating timeline item:', error);
      throw error;
    }
  };

  const deleteTimelineItem = async (id: string) => {
    try {
      storeDeleteTimelineItem(id);
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
    timelineItems: currentEventTimelineItems,
    addTimelineItem,
    updateTimelineItem: storeUpdateTimelineItem,
    deleteTimelineItem: storeDeleteTimelineItem,
    reorderItems: reorderTimelineItems,
    calculateEndTime,
    getTotalDuration,
    getEndTime,
    loading: loading || localLoading
  };
};
