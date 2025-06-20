
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useCurrentTenant } from './useCurrentTenant';

export interface Vendor {
  id: string;
  name: string;
  service_type: string | null;
  contact_person: string | null;
  phone: string | null;
  email: string | null;
  address: string | null;
  website: string | null;
  contract_status: string | null;
  notes: string | null;
  event_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface VendorDocument {
  id: string;
  name: string;
  file_url: string;
  file_type: string | null;
  file_size: number | null;
  category: string | null;
  vendor_id: string | null;
  created_at: string;
}

export const useVendors = () => {
  const { toast } = useToast();
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [documents, setDocuments] = useState<VendorDocument[]>([]);
  const [loading, setLoading] = useState(false);
  const { data: currentTenant } = useCurrentTenant();

  const loadVendors = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('vendors')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setVendors(data || []);
    } catch (error) {
      console.error('Error loading vendors:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de charger les prestataires',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const loadDocuments = async (vendorId: string) => {
    try {
      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .eq('vendor_id', vendorId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setDocuments(data || []);
    } catch (error) {
      console.error('Error loading vendor documents:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de charger les documents',
        variant: 'destructive',
      });
    }
  };

  const uploadVendorDocument = async (vendorId: string, file: File, category: string = 'contrat') => {
    if (!currentTenant) {
      toast({
        title: 'Erreur',
        description: 'Tenant non trouvé',
        variant: 'destructive',
      });
      return null;
    }

    try {
      // Upload to Supabase Storage
      const fileName = `${Date.now()}_${file.name}`;
      const filePath = `vendors/${vendorId}/documents/${fileName}`;
      
      const { error: uploadError } = await supabase.storage
        .from('documents')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Save metadata to database
      const { data, error: dbError } = await supabase
        .from('documents')
        .insert({
          vendor_id: vendorId,
          tenant_id: currentTenant.id,
          name: file.name,
          file_url: filePath,
          file_type: file.type,
          file_size: file.size,
          category: category,
          uploaded_by: 'admin',
        })
        .select()
        .single();

      if (dbError) throw dbError;

      toast({
        title: 'Document uploadé',
        description: `${file.name} a été ajouté avec succès`,
      });

      // Refresh documents
      loadDocuments(vendorId);

      return data;
    } catch (error) {
      console.error('Error uploading vendor document:', error);
      toast({
        title: 'Erreur d\'upload',
        description: `Impossible d'uploader ${file.name}`,
        variant: 'destructive',
      });
      return null;
    }
  };

  const uploadDocument = async (vendorId: string, file: File, category: string = 'other') => {
    return uploadVendorDocument(vendorId, file, category);
  };

  const deleteDocument = async (documentId: string) => {
    try {
      const { error } = await supabase
        .from('documents')
        .delete()
        .eq('id', documentId);

      if (error) throw error;

      setDocuments(prev => prev.filter(doc => doc.id !== documentId));
      toast({
        title: 'Document supprimé',
        description: 'Le document a été supprimé avec succès',
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

  const updateVendor = async (vendorId: string, updates: Partial<Vendor>) => {
    try {
      const { data, error } = await supabase
        .from('vendors')
        .update(updates)
        .eq('id', vendorId)
        .select()
        .single();

      if (error) throw error;

      setVendors(prev =>
        prev.map(vendor => (vendor.id === vendorId ? { ...vendor, ...data } : vendor))
      );

      toast({
        title: 'Prestataire mis à jour',
        description: 'Les informations du prestataire ont été modifiées avec succès',
      });
    } catch (error) {
      console.error('Error updating vendor:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de mettre à jour le prestataire',
        variant: 'destructive',
      });
    }
  };

  const addVendor = async (vendor: Omit<Vendor, 'id' | 'created_at' | 'updated_at'>) => {
    if (!currentTenant) {
      toast({ title: "Erreur", description: "Tenant non trouvé", variant: "destructive" });
      return;
    }
    try {
      const { data, error } = await supabase
        .from('vendors')
        .insert({ ...vendor, tenant_id: currentTenant.id })
        .select()
        .single();

      if (error) throw error;

      setVendors(prev => [...prev, data]);
      toast({
        title: 'Prestataire ajouté',
        description: 'Le nouveau prestataire a été créé avec succès',
      });
    } catch (error) {
      console.error('Error adding vendor:', error);
      toast({
        title: 'Erreur',
        description: "Impossible d'ajouter le prestataire",
        variant: 'destructive',
      });
    }
  };

  const deleteVendor = async (vendorId: string) => {
    try {
      const { error } = await supabase
        .from('vendors')
        .delete()
        .eq('id', vendorId);

      if (error) throw error;

      setVendors(prev => prev.filter(vendor => vendor.id !== vendorId));
      toast({
        title: 'Prestataire supprimé',
        description: 'Le prestataire a été supprimé avec succès',
      });
    } catch (error) {
      console.error('Error deleting vendor:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de supprimer le prestataire',
        variant: 'destructive',
      });
    }
  };

  useEffect(() => {
    loadVendors();
  }, []);

  return {
    vendors,
    documents,
    loading,
    loadVendors,
    loadDocuments,
    uploadVendorDocument,
    uploadDocument,
    deleteDocument,
    updateVendor,
    addVendor,
    deleteVendor,
  };
};
