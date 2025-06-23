import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useCurrentTenant } from '@/hooks/useCurrentTenant';

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
  tenant_id: string;
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
  vendor_id: string;
  created_at: string;
  updated_at?: string;
}

export const useVendors = () => {
  const { toast } = useToast();
  const { data: currentTenant } = useCurrentTenant();
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [documents, setDocuments] = useState<VendorDocument[]>([]);
  const [loading, setLoading] = useState(false);

  const loadVendors = async () => {
    if (!currentTenant?.id) {
      console.log('useVendors - Aucun tenant disponible, chargement ignoré');
      return;
    }

    setLoading(true);
    try {
      console.log('useVendors - Chargement des prestataires pour le tenant:', currentTenant.id);
      
      const { data, error } = await supabase
        .from('vendors')
        .select('*')
        .eq('tenant_id', currentTenant.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      console.log('useVendors - Prestataires chargés:', data?.length || 0);
      setVendors(data || []);
    } catch (error) {
      console.error('Erreur lors du chargement des prestataires:', error);
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
      
      // Format the data to match VendorDocument interface
      const formattedData = (data || []).map(doc => ({
        id: doc.id,
        name: doc.name,
        file_url: doc.file_url,
        file_type: doc.file_type,
        file_size: doc.file_size,
        category: doc.category,
        vendor_id: doc.vendor_id,
        created_at: doc.created_at,
        updated_at: doc.created_at // Use created_at as fallback since updated_at doesn't exist in DB
      }));
      
      setDocuments(formattedData);
    } catch (error) {
      console.error('Erreur lors du chargement des documents:', error);
    }
  };

  const addVendor = async (newVendor: Omit<Vendor, 'id' | 'created_at' | 'updated_at' | 'tenant_id'>) => {
    if (!currentTenant?.id) {
      toast({
        title: 'Erreur',
        description: 'Aucun tenant disponible',
        variant: 'destructive',
      });
      return null;
    }

    try {
      const { data, error } = await supabase
        .from('vendors')
        .insert({
          ...newVendor,
          tenant_id: currentTenant.id
        })
        .select()
        .single();

      if (error) throw error;

      console.log('useVendors - Prestataire ajouté:', data);
      setVendors(prev => [data, ...prev]);
      
      toast({
        title: 'Succès',
        description: 'Prestataire ajouté avec succès',
      });

      return data;
    } catch (error) {
      console.error('Erreur lors de l\'ajout du prestataire:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible d\'ajouter le prestataire',
        variant: 'destructive',
      });
      return null;
    }
  };

  const updateVendor = async (id: string, updates: Partial<Vendor>) => {
    try {
      const { data, error } = await supabase
        .from('vendors')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      console.log('useVendors - Prestataire mis à jour:', data);
      setVendors(prev => prev.map(vendor => 
        vendor.id === id ? data : vendor
      ));

      toast({
        title: 'Succès',
        description: 'Prestataire mis à jour avec succès',
      });
    } catch (error) {
      console.error('Erreur lors de la mise à jour du prestataire:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de mettre à jour le prestataire',
        variant: 'destructive',
      });
    }
  };

  const deleteVendor = async (id: string) => {
    try {
      const { error } = await supabase
        .from('vendors')
        .delete()
        .eq('id', id);

      if (error) throw error;

      console.log('useVendors - Prestataire supprimé:', id);
      setVendors(prev => prev.filter(vendor => vendor.id !== id));

      toast({
        title: 'Succès',
        description: 'Prestataire supprimé avec succès',
      });
    } catch (error) {
      console.error('Erreur lors de la suppression du prestataire:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de supprimer le prestataire',
        variant: 'destructive',
      });
    }
  };

  const uploadDocument = async (vendorId: string, file: File, category: string) => {
    console.log('Upload de document simulé pour le prestataire:', vendorId);
    toast({
      title: 'Information',
      description: 'Fonctionnalité d\'upload en cours de développement',
    });
  };

  const deleteDocument = async (documentId: string) => {
    console.log('Suppression de document simulée:', documentId);
  };

  useEffect(() => {
    if (currentTenant?.id) {
      loadVendors();
    }
  }, [currentTenant?.id]);

  return {
    vendors,
    documents,
    loading,
    loadVendors,
    loadDocuments,
    addVendor,
    updateVendor,
    deleteVendor,
    uploadDocument,
    deleteDocument
  };
};
