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
  category: string;
  created_at: string;
  updated_at: string;
}

interface EventStore {
  currentEventId: string | null;
  events: Event[];
  people: Person[];
  vendors: Vendor[];
  timelineItems: TimelineItem[];
  documents: Document[];
  loading: boolean;
  
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

  addTimelineItem: (item: TimelineItem) => void;
  updateTimelineItem: (id: string, updates: Partial<TimelineItem>) => void;
  deleteTimelineItem: (id: string) => void;
  reorderTimelineItems: (startIndex: number, endIndex: number) => void;

  addDocument: (document: Document) => void;
  updateDocument: (id: string, updates: Partial<Document>) => void;
  deleteDocument: (id: string) => void;
  setLoading: (loading: boolean) => void;
}

export const useEventStore = create<EventStore>()(
  persist(
    (set, get) => ({
      // État initial
      currentEventId: null,
      events: [],
      people: [],
      vendors: [],
      timelineItems: [],
      documents: [],
      loading: false,

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
    }),
    {
      name: 'event-store-v1', // Changement de version pour nettoyer les anciennes données
      version: 1,
    }
  )
);
