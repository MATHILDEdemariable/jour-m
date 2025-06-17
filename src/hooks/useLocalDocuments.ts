
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useEventStore } from '@/stores/eventStore';
import { useLocalCurrentEvent } from '@/contexts/LocalCurrentEventContext';

export interface LocalDocument {
  id: string;
  name: string;
  file_url: string;
  file_path?: string;
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
  assigned_to?: string[];
  event_id: string | null;
  vendor_id: string | null;
  created_at: string;
}

export interface LocalGoogleDriveConfig {
  id: string;
  event_id: string;
  folder_id: string;
  folder_url: string | null;
  access_token: string | null;
  refresh_token: string | null;
  is_connected: boolean | null;
  last_sync_at: string | null;
  created_at: string;
  updated_at: string;
}

export const useLocalDocuments = () => {
  const { toast } = useToast();
  const { currentEventId } = useLocalCurrentEvent();
  const { documents, addDocument, updateDocument, deleteDocument } = useEventStore();
  const [loading, setLoading] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [googleDriveConfig, setGoogleDriveConfig] = useState<LocalGoogleDriveConfig | null>(null);

  // Filter documents by current event
  const eventDocuments = documents.filter(doc => doc.event_id === currentEventId);

  const generateId = () => `doc-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  // Simulate file upload with local storage
  const uploadDocument = async (file: File, category: string, description?: string) => {
    if (!currentEventId) return;

    try {
      setLoading(true);
      
      // Convert file to base64 for local storage simulation
      const fileUrl = URL.createObjectURL(file);
      
      const newDocument: LocalDocument = {
        id: generateId(),
        event_id: currentEventId,
        name: file.name,
        file_url: fileUrl,
        file_path: `local/${file.name}`,
        file_type: file.type,
        mime_type: file.type,
        file_size: file.size,
        category,
        description,
        source: 'manual',
        google_drive_id: null,
        google_drive_url: null,
        preview_url: fileUrl,
        uploaded_by: 'Local User',
        is_shared: true,
        assigned_to: [],
        vendor_id: null,
        created_at: new Date().toISOString()
      };
      
      addDocument(newDocument);
      
      toast({
        title: 'Succès',
        description: 'Document uploadé avec succès (mode local)',
      });
      
      return newDocument;
    } catch (error) {
      console.error('Error uploading document:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible d\'uploader le document',
        variant: 'destructive',
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Simulate Google Drive connection
  const connectGoogleDrive = async (folderId: string, folderUrl: string) => {
    if (!currentEventId) return;

    try {
      const config: LocalGoogleDriveConfig = {
        id: generateId(),
        event_id: currentEventId,
        folder_id: folderId,
        folder_url: folderUrl,
        access_token: 'local-token',
        refresh_token: 'local-refresh',
        is_connected: true,
        last_sync_at: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      setGoogleDriveConfig(config);
      
      toast({
        title: 'Succès',
        description: 'Google Drive connecté avec succès (mode local)',
      });

      // Auto-sync after connection
      await syncGoogleDrive();
    } catch (error) {
      console.error('Error connecting Google Drive:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de connecter Google Drive',
        variant: 'destructive',
      });
    }
  };

  // Simulate Google Drive sync
  const syncGoogleDrive = async () => {
    if (!googleDriveConfig?.is_connected) return;

    setSyncing(true);
    try {
      // Simulate sync delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock Google Drive files
      const mockFiles = [
        {
          id: 'gdrive_1',
          name: 'Contrat_Mariage.pdf',
          mimeType: 'application/pdf',
          size: 2500000,
          webViewLink: 'https://drive.google.com/file/d/gdrive_1/view',
          downloadUrl: '#'
        },
        {
          id: 'gdrive_2',
          name: 'Photos_Venue.zip',
          mimeType: 'application/zip',
          size: 15000000,
          webViewLink: 'https://drive.google.com/file/d/gdrive_2/view',
          downloadUrl: '#'
        }
      ];

      for (const file of mockFiles) {
        // Check if file already exists
        const existingDoc = eventDocuments.find(doc => doc.google_drive_id === file.id);

        if (!existingDoc) {
          const newDocument: LocalDocument = {
            id: generateId(),
            event_id: currentEventId!,
            name: file.name,
            file_url: file.downloadUrl,
            file_path: `gdrive/${file.name}`,
            file_type: file.mimeType,
            mime_type: file.mimeType,
            file_size: file.size,
            category: 'Google Drive',
            description: 'Synchronisé depuis Google Drive',
            source: 'google_drive',
            google_drive_id: file.id,
            google_drive_url: file.webViewLink,
            preview_url: file.webViewLink,
            uploaded_by: 'Google Drive',
            is_shared: true,
            assigned_to: [],
            vendor_id: null,
            created_at: new Date().toISOString()
          };
          
          addDocument(newDocument);
        }
      }

      // Update last sync time
      setGoogleDriveConfig(prev => prev ? {
        ...prev,
        last_sync_at: new Date().toISOString()
      } : null);

      toast({
        title: 'Synchronisation réussie',
        description: `${mockFiles.length} fichiers synchronisés depuis Google Drive (mode local)`,
      });

    } catch (error) {
      console.error('Error syncing Google Drive:', error);
      toast({
        title: 'Erreur de synchronisation',
        description: 'Impossible de synchroniser avec Google Drive',
        variant: 'destructive',
      });
    } finally {
      setSyncing(false);
    }
  };

  // Update document assignment
  const updateDocumentAssignment = async (documentId: string, assignedTo: string[]) => {
    try {
      updateDocument(documentId, { assigned_to: assignedTo });
      
      toast({
        title: 'Succès',
        description: 'Assignation mise à jour',
      });
    } catch (error) {
      console.error('Error updating document assignment:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de mettre à jour l\'assignation',
        variant: 'destructive',
      });
    }
  };

  // Delete document
  const deleteDocumentLocal = async (documentId: string) => {
    try {
      deleteDocument(documentId);
      toast({
        title: 'Succès',
        description: 'Document supprimé avec succès',
      });
    } catch (error) {
      console.error('Error deleting document:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de supprimer le document',
        variant: 'destructive',
      });
    }
  };

  // Get document URL (for local files)
  const getDocumentUrl = (filePath: string) => {
    return filePath || '#';
  };

  // Statistics
  const getStats = () => {
    const totalSize = eventDocuments.reduce((sum, doc) => sum + (doc.file_size || 0), 0);
    const categories = [...new Set(eventDocuments.map(doc => doc.category).filter(Boolean))];
    const googleDriveCount = eventDocuments.filter(doc => doc.source === 'google_drive').length;
    const manualCount = eventDocuments.filter(doc => doc.source === 'manual').length;

    return {
      totalDocuments: eventDocuments.length,
      totalSize,
      categoriesCount: categories.length,
      googleDriveCount,
      manualCount,
      isGoogleDriveConnected: googleDriveConfig?.is_connected || false
    };
  };

  return {
    documents: eventDocuments,
    googleDriveConfig,
    loading,
    syncing,
    uploadDocument,
    connectGoogleDrive,
    syncGoogleDrive,
    updateDocumentAssignment,
    deleteDocument: deleteDocumentLocal,
    getDocumentUrl,
    getStats
  };
};
