
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Person {
  id: string;
  name: string;
  role: string;
  email: string;
  phone: string;
  availability: string;
  status: string;
  event_id?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Vendor {
  id: string;
  name: string;
  service_type: string | null;
  contact_person: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
  website: string | null;
  notes: string | null;
  contract_status: string | null;
  event_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface Task {
  id: string;
  title: string;
  description: string | null;
  status: 'pending' | 'in-progress' | 'completed' | 'delayed';
  priority: 'high' | 'medium' | 'low';
  duration_minutes: number;
  category_id: string | null;
  assigned_person_id: string | null;
  assigned_vendor_id: string | null;
  assigned_role: string | null;
  event_id: string | null;
  order_index: number;
  notes: string | null;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface TimelineItem {
  id: string;
  event_id: string;
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
  name: string;
  file_url: string;
  file_type: string | null;
  mime_type: string | null;
  file_size: number | null;
  category: string | null;
  description: string | null;
  source: 'manual' | 'google_drive';
  google_drive_id: string | null;
  google_drive_url: string | null;
  preview_url: string | null;
  uploaded_by: string | null;
  is_shared: boolean | null;
  event_id: string | null;
  vendor_id: string | null;
  created_at: string;
}

export interface EventData {
  id: string;
  name: string;
  event_type: string;
  event_date: string;
  slug: string;
  start_time: string | null;
  location: string | null;
  description: string | null;
  google_drive_url: string | null;
  status: string;
  created_at: string;
  updated_at: string;
  magic_word?: string | null;
  share_token?: string | null;
}

interface EventStore {
  // Current event
  currentEventId: string;
  
  // Data
  people: Person[];
  vendors: Vendor[];
  tasks: Task[];
  timelineItems: TimelineItem[];
  documents: Document[];
  events: EventData[];
  planningItems: any[];
  
  // Loading states
  loading: boolean;
  
  // Actions
  setCurrentEventId: (id: string) => void;
  setPeople: (people: Person[]) => void;
  setVendors: (vendors: Vendor[]) => void;
  setTasks: (tasks: Task[]) => void;
  setTimelineItems: (items: TimelineItem[]) => void;
  setDocuments: (documents: Document[]) => void;
  setEvents: (events: EventData[]) => void;
  setPlanningItems: (items: any[]) => void;
  setLoading: (loading: boolean) => void;
  
  // Data manipulation
  addPerson: (person: Person) => void;
  updatePerson: (id: string, updates: Partial<Person>) => void;
  deletePerson: (id: string) => void;
  
  addVendor: (vendor: Vendor) => void;
  updateVendor: (id: string, updates: Partial<Vendor>) => void;
  deleteVendor: (id: string) => void;
  
  addTask: (task: Task) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  
  addTimelineItem: (item: TimelineItem) => void;
  updateTimelineItem: (id: string, updates: Partial<TimelineItem>) => void;
  deleteTimelineItem: (id: string) => void;
  
  addDocument: (document: Document) => void;
  updateDocument: (id: string, updates: Partial<Document>) => void;
  deleteDocument: (id: string) => void;
  
  // Utility
  refreshData: () => void;
  resetAllData: () => void;
  exportData: () => string;
  importData: (jsonData: string) => void;
}

// Default event ID
const DEFAULT_EVENT_ID = 'default-event-1';

// Initial sample data
const initialSampleData = {
  events: [{
    id: DEFAULT_EVENT_ID,
    name: 'Mon Événement',
    event_type: 'wedding',
    event_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days from now
    slug: 'mon-evenement',
    start_time: '14:00',
    location: 'Lieu de réception',
    description: 'Description de votre événement',
    google_drive_url: null,
    status: 'active',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    magic_word: 'MAGIC2025',
    share_token: 'sample-share-token'
  }],
  people: [
    {
      id: 'person-1',
      name: 'Marie Dupont',
      role: 'Wedding Planner',
      email: 'marie@example.com',
      phone: '06 12 34 56 78',
      availability: 'Disponible toute la journée',
      status: 'confirmed',
      event_id: DEFAULT_EVENT_ID,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: 'person-2', 
      name: 'Jean Martin',
      role: 'Photographe',
      email: 'jean@example.com',
      phone: '06 98 76 54 32',
      availability: 'Disponible de 14h à 22h',
      status: 'confirmed',
      event_id: DEFAULT_EVENT_ID,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ],
  vendors: [
    {
      id: 'vendor-1',
      name: 'Fleurs & Co',
      service_type: 'Fleuriste',
      contact_person: 'Sophie Leblanc',
      email: 'contact@fleursetco.fr',
      phone: '01 23 45 67 89',
      address: '123 Rue des Fleurs, Paris',
      website: 'www.fleursetco.fr',
      notes: 'Spécialisé dans les mariages',
      contract_status: 'signed',
      event_id: DEFAULT_EVENT_ID,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ],
  tasks: [
    {
      id: 'task-1',
      title: 'Vérifier la décoration florale',
      description: 'S\'assurer que tous les arrangements floraux sont en place',
      status: 'pending' as const,
      priority: 'high' as const,
      duration_minutes: 30,
      category_id: null,
      assigned_person_id: 'person-1',
      assigned_vendor_id: 'vendor-1',
      assigned_role: null,
      event_id: DEFAULT_EVENT_ID,
      order_index: 0,
      notes: 'Priorité absolue',
      completed_at: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ],
  timelineItems: [
    {
      id: 'timeline-1',
      event_id: DEFAULT_EVENT_ID,
      title: 'Arrivée des invités',
      description: 'Accueil et placement des invités',
      time: '14:00',
      duration: 30,
      category: 'Cérémonie',
      status: 'scheduled' as const,
      priority: 'high' as const,
      assigned_person_id: 'person-1',
      assigned_person_ids: ['person-1'],
      assigned_vendor_id: null,
      assigned_role: null,
      order_index: 0,
      notes: 'Prévoir un accueil chaleureux',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ],
  documents: [],
  planningItems: []
};

export const useEventStore = create<EventStore>()(
  persist(
    (set, get) => ({
      // Initial state
      currentEventId: DEFAULT_EVENT_ID,
      people: initialSampleData.people,
      vendors: initialSampleData.vendors,
      tasks: initialSampleData.tasks,
      timelineItems: initialSampleData.timelineItems,
      documents: initialSampleData.documents,
      events: initialSampleData.events,
      planningItems: initialSampleData.planningItems,
      loading: false,

      // Basic setters
      setCurrentEventId: (id) => set({ currentEventId: id }),
      setPeople: (people) => set({ people }),
      setVendors: (vendors) => set({ vendors }),
      setTasks: (tasks) => set({ tasks }),
      setTimelineItems: (timelineItems) => set({ timelineItems }),
      setDocuments: (documents) => set({ documents }),
      setEvents: (events) => set({ events }),
      setPlanningItems: (planningItems) => set({ planningItems }),
      setLoading: (loading) => set({ loading }),

      // People actions
      addPerson: (person) => set((state) => ({ 
        people: [person, ...state.people] 
      })),
      updatePerson: (id, updates) => set((state) => ({
        people: state.people.map(p => p.id === id ? { ...p, ...updates } : p)
      })),
      deletePerson: (id) => set((state) => ({
        people: state.people.filter(p => p.id !== id)
      })),

      // Vendors actions
      addVendor: (vendor) => set((state) => ({ 
        vendors: [vendor, ...state.vendors] 
      })),
      updateVendor: (id, updates) => set((state) => ({
        vendors: state.vendors.map(v => v.id === id ? { ...v, ...updates } : v)
      })),
      deleteVendor: (id) => set((state) => ({
        vendors: state.vendors.filter(v => v.id !== id)
      })),

      // Tasks actions
      addTask: (task) => set((state) => ({ 
        tasks: [task, ...state.tasks] 
      })),
      updateTask: (id, updates) => set((state) => ({
        tasks: state.tasks.map(t => t.id === id ? { ...t, ...updates } : t)
      })),
      deleteTask: (id) => set((state) => ({
        tasks: state.tasks.filter(t => t.id !== id)
      })),

      // Timeline actions
      addTimelineItem: (item) => set((state) => ({ 
        timelineItems: [...state.timelineItems, item] 
      })),
      updateTimelineItem: (id, updates) => set((state) => ({
        timelineItems: state.timelineItems.map(t => t.id === id ? { ...t, ...updates } : t)
      })),
      deleteTimelineItem: (id) => set((state) => ({
        timelineItems: state.timelineItems.filter(t => t.id !== id)
      })),

      // Documents actions
      addDocument: (document) => set((state) => ({ 
        documents: [document, ...state.documents] 
      })),
      updateDocument: (id, updates) => set((state) => ({
        documents: state.documents.map(d => d.id === id ? { ...d, ...updates } : d)
      })),
      deleteDocument: (id) => set((state) => ({
        documents: state.documents.filter(d => d.id !== id)
      })),

      // Utility functions
      refreshData: () => {
        // In localStorage version, this is a no-op since data is always fresh
        console.log('Data refreshed from localStorage');
      },
      
      resetAllData: () => {
        set({
          people: initialSampleData.people,
          vendors: initialSampleData.vendors,
          tasks: initialSampleData.tasks,
          timelineItems: initialSampleData.timelineItems,
          documents: initialSampleData.documents,
          events: initialSampleData.events,
          planningItems: initialSampleData.planningItems,
          currentEventId: DEFAULT_EVENT_ID
        });
      },

      exportData: () => {
        const state = get();
        const exportData = {
          people: state.people,
          vendors: state.vendors,
          tasks: state.tasks,
          timelineItems: state.timelineItems,
          documents: state.documents,
          events: state.events,
          planningItems: state.planningItems,
          currentEventId: state.currentEventId,
          exportedAt: new Date().toISOString()
        };
        return JSON.stringify(exportData, null, 2);
      },

      importData: (jsonData) => {
        try {
          const data = JSON.parse(jsonData);
          set({
            people: data.people || [],
            vendors: data.vendors || [],
            tasks: data.tasks || [],
            timelineItems: data.timelineItems || [],
            documents: data.documents || [],
            events: data.events || [],
            planningItems: data.planningItems || [],
            currentEventId: data.currentEventId || DEFAULT_EVENT_ID
          });
        } catch (error) {
          console.error('Error importing data:', error);
        }
      }
    }),
    {
      name: 'jourj-event-storage',
      version: 1,
    }
  )
);
