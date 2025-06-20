
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useCurrentTenant } from './useCurrentTenant';

export interface EventDocument {
  id: string;
  event_id: string;
  name: string;
  file_url: string;
  file_size: number | null;
  mime_type: string | null;
  source: string;
  assigned_to: string[] | null;
  created_at: string;
  updated_at: string;
}

export const useEventDocuments = (eventId: string | null) => {
  const { toast } = useToast();
  const [documents, setDocuments] = useState<EventDocument[]>([]);
  const [uploading, setUploading] = useState(false);
  const { data: currentTenant } = useCurrentTenant();

  const loadDocuments = async () => {
    if (!eventId) return;
    
    try {
      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .eq('event_id', eventId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Map the data to our interface
      const mappedDocuments: EventDocument[] = (data || []).map(doc => ({
        id: doc.id,
        event_id: doc.event_id || '',
        name: doc.name,
        file_url: doc.file_url,
        file_size: doc.file_size,
        mime_type: doc.mime_type,
        source: doc.source || 'manual',
        assigned_to: doc.assigned_to,
        created_at: doc.created_at,
        updated_at: doc.created_at // Use created_at as fallback for updated_at
      }));
      
      setDocuments(mappedDocuments);
    } catch (error) {
      console.error('Error loading documents:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de charger les documents',
        variant: 'destructive',
      });
    }
  };

  const uploadDocuments = async (files: FileList) => {
    if (!eventId || files.length === 0 || !currentTenant) return;

    setUploading(true);
    const uploadPromises = Array.from(files).map(async (file) => {
      try {
        // Upload to Supabase Storage
        const fileName = `${Date.now()}_${file.name}`;
        const filePath = `events/${eventId}/documents/${fileName}`;
        
        const { error: uploadError } = await supabase.storage
          .from('documents')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        // Save metadata to database
        const { data, error: dbError } = await supabase
          .from('documents')
          .insert({
            event_id: eventId,
            tenant_id: currentTenant.id,
            name: file.name,
            file_url: filePath,
            file_size: file.size,
            mime_type: file.type,
            source: 'manual',
            assigned_to: [],
          })
          .select()
          .single();

        if (dbError) throw dbError;
        
        // Map to our interface
        const mappedDocument: EventDocument = {
          id: data.id,
          event_id: data.event_id || '',
          name: data.name,
          file_url: data.file_url,
          file_size: data.file_size,
          mime_type: data.mime_type,
          source: data.source || 'manual',
          assigned_to: data.assigned_to,
          created_at: data.created_at,
          updated_at: data.created_at
        };
        
        return mappedDocument;
      } catch (error) {
        console.error(`Error uploading ${file.name}:`, error);
        toast({
          title: 'Erreur d\'upload',
          description: `Impossible d'uploader ${file.name}`,
          variant: 'destructive',
        });
        return null;
      }
    });

    try {
      const results = await Promise.all(uploadPromises);
      const successfulUploads = results.filter(result => result !== null) as EventDocument[];
      
      if (successfulUploads.length > 0) {
        setDocuments(prev => [...successfulUploads, ...prev]);
        toast({
          title: 'Upload réussi',
          description: `${successfulUploads.length} fichier(s) uploadé(s) avec succès`,
        });
      }
    } catch (error) {
      console.error('Error during batch upload:', error);
    } finally {
      setUploading(false);
    }
  };

  const updateDocumentAssignment = async (documentId: string, assignedTo: string[]) => {
    try {
      const { data, error } = await supabase
        .from('documents')
        .update({ assigned_to: assignedTo })
        .eq('id', documentId)
        .select()
        .single();

      if (error) throw error;
      
      setDocuments(prev => prev.map(doc => 
        doc.id === documentId ? { ...doc, assigned_to: assignedTo } : doc
      ));
      
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

  const deleteDocument = async (documentId: string) => {
    try {
      const document = documents.find(doc => doc.id === documentId);
      if (!document) return;

      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from('documents')
        .remove([document.file_url]);

      if (storageError) throw storageError;

      // Delete from database
      const { error: dbError } = await supabase
        .from('documents')
        .delete()
        .eq('id', documentId);

      if (dbError) throw dbError;

      setDocuments(prev => prev.filter(doc => doc.id !== documentId));
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

  const getDocumentUrl = (filePath: string) => {
    const { data } = supabase.storage
      .from('documents')
      .getPublicUrl(filePath);
    return data.publicUrl;
  };

  useEffect(() => {
    loadDocuments();
  }, [eventId]);

  return {
    documents,
    uploading,
    uploadDocuments,
    updateDocumentAssignment,
    deleteDocument,
    getDocumentUrl,
    loadDocuments
  };
};
