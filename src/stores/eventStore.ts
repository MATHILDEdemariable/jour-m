import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Event {
  id: string;
  name: string;
  event_type: string;
  event_date: string;
  location: string;
  description: string;
  magic_word?: string;
  theme_color?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Person {
  id: string;
  event_id: string | null;
  name: string;
  role: string;
  email: string;
  phone: string;
  availability: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface Vendor {
  id: string;
  event_id: string | null;
  name: string;
  service_type: string;
  contact_person: string;
  email: string;
  phone: string;
  address: string;
  website: string;
  notes: string;
  contract_status: string;
  created_at: string;
  updated_at: string;
}

export interface Task {
  id: string;
  event_id: string | null;
  title: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed';
  priority: 'high' | 'medium' | 'low';
  assigned_person_id: string | null;
  assigned_vendor_id: string | null;
  due_date: string;
  duration_minutes?: number;
  notes?: string;
  completed_at?: string;
  created_at: string;
  updated_at: string;
}

export interface PlanningItem {
  id: string;
  event_id: string | null;
  title: string;
  description?: string;
  time?: string;
  duration?: number;
  category: string;
  status: 'scheduled' | 'in_progress' | 'completed';
  assigned_person_id?: string;
  assigned_vendor_id?: string;
  created_at: string;
  updated_at: string;
}

export interface TimelineItem {
  id: string;
  event_id: string | null;
  title: string;
  description: string | null;
  time: string;
  duration: number;
  category: string;
  status: 'scheduled' | 'in_progress' | 'completed' | 'delayed';
  priority: 'high' | 'medium' | 'low';
  assigned_person_id: string | null;
  assigned_person_ids: string[];
  assigned_vendor_id: string | null;
  assigned_role: string | null;
  order_index: number;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface Document {
  id: string;
  event_id: string | null;
  vendor_id: string | null;
  name: string;
  url: string;
  file_url?: string;
  file_path?: string;
  file_type?: string | null;
  mime_type?: string | null;
  file_size?: number | null;
  category: string;
  description?: string | null;
  source?: 'manual' | 'google_drive';
  google_drive_id?: string | null;
  google_drive_url?: string | null;
  preview_url?: string | null;
  uploaded_by?: string | null;
  is_shared?: boolean | null;
  assigned_to?: string[];
  created_at: string;
  updated_at: string;
}

interface EventStore {
  currentEventId: string | null;
  events: Event[];
  people: Person[];
  vendors: Vendor[];
  tasks: Task[];
  planningItems: PlanningItem[];
  timelineItems: TimelineItem[];
  documents: Document[];
  loading: boolean;
  isOffline: boolean;
  lastSyncAt: string | null;
  
  setCurrentEventId: (eventId: string | null) => void;
  addEvent: (event: Event) => void;
  updateEvent: (id: string, updates: Partial<Event>) => void;
  deleteEvent: (id: string) => void;
  
  addPerson: (person: Person) => void;
  updatePerson: (id: string, updates: Partial<Person>) => void;
  deletePerson: (id: string) => void;
  
  addVendor: (vendor: Vendor) => void;
  updateVendor: (id: string, updates: Partial<Vendor>) => void;
  deleteVendor: (id: string) => void;

  addTask: (task: Task) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;

  addPlanningItem: (item: PlanningItem) => void;
  updatePlanningItem: (id: string, updates: Partial<PlanningItem>) => void;
  deletePlanningItem: (id: string) => void;

  addTimelineItem: (item: TimelineItem) => void;
  updateTimelineItem: (id: string, updates: Partial<TimelineItem>) => void;
  deleteTimelineItem: (id: string) => void;
  reorderTimelineItems: (startIndex: number, endIndex: number) => void;

  addDocument: (document: Document) => void;
  updateDocument: (id: string, updates: Partial<Document>) => void;
  deleteDocument: (id: string) => void;
  setLoading: (loading: boolean) => void;
  
  // Data management methods
  refreshData: () => Promise<void>;
  resetAllData: () => void;
  exportData: () => string;
  importData: (data: string) => void;
  createBackup: () => string;
  restoreFromBackup: (backup: string) => boolean;
  getStorageSize: () => number;
}

export const useEventStore = create<EventStore>()(
  persist(
    (set, get) => ({
      // État initial
      currentEventId: null,
      events: [],
      people: [],
      vendors: [],
      tasks: [],
      planningItems: [],
      timelineItems: [],
      documents: [],
      loading: false,
      isOffline: false,
      lastSyncAt: null,

      // Méthodes pour manipuler l'état
      setCurrentEventId: (eventId) => set({ currentEventId: eventId }),
      addEvent: (event) => set((state) => ({ events: [...state.events, event] })),
      updateEvent: (id, updates) => set((state) => ({
        events: state.events.map(event => event.id === id ? { ...event, ...updates } : event)
      })),
      deleteEvent: (id) => set((state) => ({ events: state.events.filter(event => event.id !== id) })),

      addPerson: (person) => set((state) => ({ people: [...state.people, person] })),
      updatePerson: (id, updates) => set((state) => ({
        people: state.people.map(person => person.id === id ? { ...person, ...updates } : person)
      })),
      deletePerson: (id) => set((state) => ({ people: state.people.filter(person => person.id !== id) })),

      addVendor: (vendor) => set((state) => ({ vendors: [...state.vendors, vendor] })),
      updateVendor: (id, updates) => set((state) => ({
        vendors: state.vendors.map(vendor => vendor.id === id ? { ...vendor, ...updates } : vendor)
      })),
      deleteVendor: (id) => set((state) => ({ vendors: state.vendors.filter(vendor => vendor.id !== id) })),

      addTask: (task) => set((state) => ({ tasks: [...state.tasks, task] })),
      updateTask: (id, updates) => set((state) => ({
        tasks: state.tasks.map(task => task.id === id ? { ...task, ...updates } : task)
      })),
      deleteTask: (id) => set((state) => ({ tasks: state.tasks.filter(task => task.id !== id) })),

      addPlanningItem: (item) => set((state) => ({ planningItems: [...state.planningItems, item] })),
      updatePlanningItem: (id, updates) => set((state) => ({
        planningItems: state.planningItems.map(item => item.id === id ? { ...item, ...updates } : item)
      })),
      deletePlanningItem: (id) => set((state) => ({ planningItems: state.planningItems.filter(item => item.id !== id) })),

      addTimelineItem: (item) => set((state) => ({ timelineItems: [...state.timelineItems, item] })),
      updateTimelineItem: (id, updates) => set((state) => ({
        timelineItems: state.timelineItems.map(item => item.id === id ? { ...item, ...updates } : item)
      })),
      deleteTimelineItem: (id) => set((state) => ({ timelineItems: state.timelineItems.filter(item => item.id !== id) })),
      reorderTimelineItems: (startIndex, endIndex) => set((state) => {
        const { timelineItems } = get();
        const reorderedItems = [...timelineItems];
        const [removed] = reorderedItems.splice(startIndex, 1);
        reorderedItems.splice(endIndex, 0, removed);
        return { timelineItems: reorderedItems };
      }),

      addDocument: (document) => set((state) => ({ documents: [...state.documents, document] })),
      updateDocument: (id, updates) => set((state) => ({
        documents: state.documents.map(document => document.id === id ? { ...document, ...updates } : document)
      })),
      deleteDocument: (id) => set((state) => ({ documents: state.documents.filter(document => document.id !== id) })),
      setLoading: (loading) => set({ loading }),

      // Data management methods
      refreshData: async () => {
        // Implementation for refreshing data
        set({ lastSyncAt: new Date().toISOString() });
      },
      resetAllData: () => set({
        events: [],
        people: [],
        vendors: [],
        tasks: [],
        planningItems: [],
        timelineItems: [],
        documents: [],
        currentEventId: null
      }),
      exportData: () => {
        const state = get();
        return JSON.stringify(state);
      },
      importData: (data: string) => {
        try {
          const importedState = JSON.parse(data);
          set(importedState);
        } catch (error) {
          console.error('Error importing data:', error);
        }
      },
      createBackup: () => {
        const state = get();
        return JSON.stringify({
          timestamp: new Date().toISOString(),
          data: state
        });
      },
      restoreFromBackup: (backup: string) => {
        try {
          const { data } = JSON.parse(backup);
          set(data);
          return true;
        } catch (error) {
          console.error('Error restoring backup:', error);
          return false;
        }
      },
      getStorageSize: () => {
        const state = get();
        return JSON.stringify(state).length;
      }
    }),
    {
      name: 'event-store-v1',
      version: 1,
    }
  )
);
