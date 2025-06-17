
import { useState } from 'react';
import { useEventStore } from '@/stores/eventStore';
import type { Vendor } from '@/stores/eventStore';

// Hook qui remplace useVendors en gardant exactement la même interface
export const useLocalVendors = () => {
  const {
    vendors,
    addVendor: addVendorToStore,
    updateVendor: updateVendorInStore,
    deleteVendor: deleteVendorFromStore,
    loading
  } = useEventStore();

  const [localLoading, setLocalLoading] = useState(false);
  const [documents, setDocuments] = useState<any[]>([]);

  const generateId = () => `vendor-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  const loadVendors = async () => {
    setLocalLoading(true);
    // Simulate async operation for compatibility
    await new Promise(resolve => setTimeout(resolve, 100));
    setLocalLoading(false);
    console.log('useLocalVendors - Vendors loaded from localStorage');
  };

  const loadDocuments = async (vendorId: string) => {
    // Simulate loading documents for a vendor
    setDocuments([]);
  };

  const addVendor = async (newVendor: Omit<Vendor, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const currentEventId = localStorage.getItem('currentEventId') || 'default-event';
      
      const vendor: Vendor = {
        ...newVendor,
        id: generateId(),
        event_id: currentEventId, // ESSENTIEL - utiliser l'event_id actuel
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      console.log('useLocalVendors - Adding vendor with event_id:', currentEventId, vendor);
      addVendorToStore(vendor);
      return vendor;
    } catch (error) {
      console.error('Error adding vendor:', error);
      throw error;
    }
  };

  const updateVendor = async (id: string, updates: Partial<Vendor>) => {
    try {
      const updatedData = {
        ...updates,
        updated_at: new Date().toISOString()
      };
      updateVendorInStore(id, updatedData);
      console.log('useLocalVendors - Vendor updated:', id);
    } catch (error) {
      console.error('Error updating vendor:', error);
      throw error;
    }
  };

  const deleteVendor = async (id: string) => {
    try {
      deleteVendorFromStore(id);
      console.log('useLocalVendors - Vendor deleted:', id);
    } catch (error) {
      console.error('Error deleting vendor:', error);
      throw error;
    }
  };

  const uploadDocument = async (vendorId: string, file: File, category: string) => {
    // Simulate document upload
    console.log('Document upload simulated for vendor:', vendorId);
  };

  const deleteDocument = async (documentId: string) => {
    // Simulate document deletion
    console.log('Document deletion simulated:', documentId);
  };

  return {
    vendors,
    documents,
    loading: loading || localLoading,
    loadVendors,
    loadDocuments,
    addVendor,
    updateVendor,
    deleteVendor,
    uploadDocument,
    deleteDocument
  };
};
